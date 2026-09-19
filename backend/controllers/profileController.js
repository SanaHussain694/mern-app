// backend/controllers/profileController.js
const JobSeekerProfile = require('../models/JobSeekerProfile');

// ─── GET /api/profile/:userId ────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const profile = await JobSeekerProfile
      .findOne({ user: req.params.userId })
      .populate('user', 'name email role');

    if (!profile) {
      return res.status(404).json({ message: 'Profile nahi mili!' });
    }

    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── PUT /api/profile/:userId ────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { phone, city, bio, skills, education, experience } = req.body;

    const profile = await JobSeekerProfile.findOneAndUpdate(
      { user: req.params.userId },
      {
        $set: {
          user: req.params.userId,   // ✅ upsert ke waqt user field set hogi
          phone,
          city,
          bio,
          skills,
          education,
          experience,
        },
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── POST /api/profile/upload-cv ─────────────────────────
exports.uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File select karo!' });
    }

    const cvUrl = `/uploads/${req.file.filename}`;

    const profile = await JobSeekerProfile.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: {
          user: req.user.id,         // ✅ same fix here
          cvUrl,
        },
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, cvUrl, profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};