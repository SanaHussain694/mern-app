const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');

// ---------------------------------------------------------------
// Auto-detect your existing auth middleware (no need to know its name).
// Tries common folder/file names and common export names.
// ---------------------------------------------------------------
function loadAuth() {
  const files = [
    '../middleware/auth', '../middleware/authMiddleware', '../middleware/protect',
    '../middleware/authenticate', '../middleware/verifyToken', '../middleware/jwt',
    '../middlewares/auth', '../middlewares/authMiddleware', '../middlewares/protect',
    '../middlewares/authenticate', '../middlewares/verifyToken',
    '../middleware/index', '../middlewares/index',
  ];
  const names = [
    'protect', 'auth', 'authenticate', 'verifyToken',
    'authMiddleware', 'isAuthenticated', 'requireAuth',
  ];
  for (const f of files) {
    let mod;
    try { mod = require(f); } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') continue;
      throw e;
    }
    if (typeof mod === 'function') return mod;
    for (const n of names) if (typeof mod?.[n] === 'function') return mod[n];
    if (typeof mod?.default === 'function') return mod.default;
  }
  throw new Error(
    'Auth middleware not found. Open routes/jobs.js, copy its auth require line, ' +
    'and set: const auth = <that>;'
  );
}
const auth = loadAuth();

const uid = (req) => String(req.user._id || req.user.id);

// Seeker applies to a job
router.post('/apply/:jobId', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job || job.isActive === false)
      return res.status(404).json({ message: 'Job not available' });

    const application = await Application.create({
      seeker: uid(req),
      job: job._id,
    });
    res.status(201).json(application);
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: 'You already applied' });
    res.status(500).json({ message: err.message });
  }
});

// Seeker: my applications
router.get('/mine', auth, async (req, res) => {
  try {
    const apps = await Application.find({ seeker: uid(req) }).populate('job');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Provider: total candidates across my jobs (dashboard card)
router.get('/provider/count', auth, async (req, res) => {
  try {
    const myJobs = await Job.find({ postedBy: uid(req) }).select('_id');
    const total = await Application.countDocuments({
      job: { $in: myJobs.map((j) => j._id) },
    });
    res.json({ total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Provider: candidates of one job
router.get('/job/:jobId', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job || String(job.postedBy) !== uid(req))
      return res.status(403).json({ message: 'Not allowed' });

    const apps = await Application.find({ job: job._id })
      .populate('seeker', 'name email')
      .sort({ appliedAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Provider: change application status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['applied', 'shortlisted', 'rejected'].includes(status))
      return res.status(400).json({ message: 'Invalid status' });

    const app = await Application.findById(req.params.id).populate('job');
    if (!app || String(app.job.postedBy) !== uid(req))
      return res.status(403).json({ message: 'Not allowed' });

    app.status = status;
    await app.save();
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
