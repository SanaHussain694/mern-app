// backend/controllers/adminController.js
const User         = require('../models/User');
const Job          = require('../models/Job');
const Assessment   = require('../models/Assessment');
const Interview    = require('../models/Interview');
const BehaviorLog  = require('../models/BehaviorLog');
const JobSeekerProfile = require('../models/JobSeekerProfile');

// ─── GET /api/admin/stats ────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      jobSeekers,
      jobProviders,
      activeJobs,
      totalAssessments,
      totalInterviews,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'jobSeeker' }),
      User.countDocuments({ role: 'jobProvider' }),
      Job.countDocuments({ isActive: true }),
      Assessment.countDocuments({ status: 'submitted' }),
      Interview.countDocuments({ status: 'completed' }),
    ]);

    // Last 7 days registrations
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newUsers = await User.countDocuments({ createdAt: { $gte: weekAgo } });

    // Recent 5 jobs
    const recentJobs = await Job.find({ isActive: true })
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title location createdAt postedBy');

    res.json({
      success: true,
      stats: {
        totalUsers, jobSeekers, jobProviders,
        activeJobs, totalAssessments, totalInterviews, newUsers,
      },
      recentJobs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/admin/users ────────────────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1 } = req.query;
    const limit  = 10;
    const filter = {};

    if (role)   filter.role  = role;
    if (search) filter.$or   = [
      { name:  { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      users,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── PUT /api/admin/users/:id/suspend ───────────────────
exports.toggleSuspend = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User nahi mila!' });

    // Admin ko suspend nahi kar sakte
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Admin ko suspend nahi kar sakte!' });
    }

    user.isSuspended = !user.isSuspended;
    await user.save();

    res.json({
      success: true,
      message: user.isSuspended ? 'User suspended!' : 'User activated!',
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/admin/candidates ──────────────────────────
exports.getCandidates = async (req, res) => {
  try {
    const { search } = req.query;

    const userFilter = { role: 'jobSeeker' };
    if (search) userFilter.$or = [
      { name:  { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];

    const users = await User.find(userFilter).select('-password');

    // Har user ka profile + assessment + interview data
    const candidates = await Promise.all(
      users.map(async (u) => {
        const [profile, assessments, interviews, behaviorLogs] =
          await Promise.all([
            JobSeekerProfile.findOne({ user: u._id }),
            Assessment.find({ userId: u._id })
              .sort({ createdAt: -1 }).limit(1),
            Interview.find({ userId: u._id })
              .sort({ createdAt: -1 }).limit(1),
            BehaviorLog.countDocuments({ userId: u._id }),
          ]);

        return {
          user:          { ...u.toObject(), password: undefined },
          profile:       profile || null,
          lastAssessment:assessments[0] || null,
          lastInterview: interviews[0]  || null,
          behaviorEvents:behaviorLogs,
        };
      })
    );

    res.json({ success: true, candidates });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/admin/candidates/:userId/detail ───────────
exports.getCandidateDetail = async (req, res) => {
  try {
    const { userId } = req.params;

    const [user, profile, assessments, interviews, behaviorLogs] =
      await Promise.all([
        User.findById(userId).select('-password'),
        JobSeekerProfile.findOne({ user: userId }),
        Assessment.find({ userId }).populate('questions').sort({ createdAt: -1 }),
        Interview.find({ userId }).sort({ createdAt: -1 }),
        BehaviorLog.find({ userId }).sort({ timestamp: 1 }),
      ]);

    if (!user) return res.status(404).json({ message: 'User nahi mila!' });

    res.json({ success: true, user, profile, assessments, interviews, behaviorLogs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};