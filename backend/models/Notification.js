// backend/models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  type: {
    type: String,
    enum: [
      'job_match',        // skill match hoi
      'application',      // koi apply kiya
      'assessment_done',  // assessment complete
      'interview_invite', // interview invite
      'profile_view',     // profile dekhi
      'general',
    ],
    default: 'general',
  },
  message:  { type: String, required: true },
  link:     { type: String, default: '' },  // click pe kahan jaye
  isRead:   { type: Boolean, default: false },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);