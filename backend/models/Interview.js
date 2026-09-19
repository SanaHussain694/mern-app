// backend/models/Interview.js
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:  'InterviewQuestion',
  },
  questionText: { type: String },
  answer:       { type: String, default: '' },
  aiFollowUp:   { type: String, default: '' }, // GPT se generate
  timeTaken:    { type: Number, default: 0 },
  skipped:      { type: Boolean, default: false },
});

const interviewSchema = new mongoose.Schema({
  userId: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  domain: {
    type: String,
    enum: ['web-dev', 'data-science', 'mobile', 'general'],
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:  'InterviewQuestion',
  }],
  answers:  [answerSchema],
  videoUrl: { type: String, default: '' }, // Cloudinary ya local
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress',
  },
  completedAt: { type: Date },
  totalTime:   { type: Number, default: 0 }, // seconds
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);