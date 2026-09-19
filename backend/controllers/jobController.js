// backend/controllers/jobController.js
const Job = require('../models/Job');
const { sendJobMatchNotifications } = require('./notificationController'); // ✅ moved to top

// ─── POST /api/jobs — Job post karo ─────────────────────
exports.createJob = async (req, res) => {
  try {
    const {
      title, description, requiredSkills,
      experience, location, salary, jobType
    } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ message: 'Title, description aur location required hain!' });
    }

    const job = await Job.create({
      title,
      description,
      requiredSkills: requiredSkills || [],
      experience,
      location,
      salary,
      jobType,
      postedBy: req.user.id,
    });

    sendJobMatchNotifications(job); // ✅ background mein — no await

    res.status(201).json({ success: true, job });

  } catch (err) {
    console.error('❌ Job create error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/jobs — Sari jobs ──────────────────────────
exports.getAllJobs = async (req, res) => {
  try {
    const { search, location, experience, jobType } = req.query;

    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { title:       { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { requiredSkills: { $in: [new RegExp(search, 'i')] } },
      ];
    }
    if (location)   filter.location   = { $regex: location, $options: 'i' };
    if (experience) filter.experience = experience;
    if (jobType)    filter.jobType    = jobType;

    const jobs = await Job.find(filter)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: jobs.length, jobs });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/jobs/:id — Single job ─────────────────────
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email');

    if (!job) return res.status(404).json({ message: 'Job nahi mili!' });

    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/jobs/my-jobs — Provider ki apni jobs ──────
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: jobs.length, jobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── DELETE /api/jobs/:id — Job delete ──────────────────
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: 'Job nahi mili!' });

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Aap sirf apni job delete kar sakte hain!' });
    }

    await job.deleteOne();
    res.json({ success: true, message: 'Job delete ho gayi!' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};