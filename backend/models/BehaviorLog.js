// backend/models/BehaviorLog.js
const mongoose = require('mongoose');

const behaviorLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
  },
  eventType: {
    type: String,
    enum: [
      'no_face',          // koi face nahi
      'multiple_faces',   // ek se zyada log
      'face_away',        // face dusri taraf
      'tab_switch',       // tab change kiya
      'fullscreen_exit',  // fullscreen chhoda
      'assessment_start', // test shuru
      'assessment_end',   // test khatam
    ],
    required: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  message:   { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('BehaviorLog', behaviorLogSchema);