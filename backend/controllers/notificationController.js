// backend/controllers/notificationController.js
const Notification = require('../models/Notification');
const User         = require('../models/User');
const Job          = require('../models/Job');
const JobSeekerProfile = require('../models/JobSeekerProfile');

// ─── POST /api/notifications ────────────────────────────
exports.createNotification = async (req, res) => {
  try {
    const { userId, type, message, link, metadata } = req.body;

    const notif = await Notification.create({
      userId, type, message,
      link:     link     || '',
      metadata: metadata || {},
    });

    res.status(201).json({ success: true, notification: notif });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/notifications/:userId ─────────────────────
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification
      .find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({
      userId: req.params.userId,
      isRead: false,
    });

    res.json({ success: true, notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── PUT /api/notifications/:id/read ────────────────────
exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── PUT /api/notifications/read-all ────────────────────
exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { isRead: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── JOB MATCH — Jab job post ho ────────────────────────
exports.sendJobMatchNotifications = async (job) => {
  try {
    // Job ke requiredSkills se match karo
    const profiles = await JobSeekerProfile.find({
      skills: { $in: job.requiredSkills },
    }).populate('user');

    const notifications = profiles
      .filter(p => p.user) // user exist karta ho
      .map(p => ({
        userId:   p.user._id,
        type:     'job_match',
        message:  `New job match mila: "${job.title}" at ${job.location}`,
        link:     `/jobs`,
        metadata: { jobId: job._id, jobTitle: job.title },
      }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
      console.log(`✅ ${notifications.length} job match notifications sent`);
    }
  } catch (err) {
    console.error('Job match notification error:', err.message);
  }
};