// backend/models/Assessment.js
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  },
  userAnswer:    { type: String, default: '' },
  correctAnswer: { type: String },
  isCorrect:     { type: Boolean, default: false },
  type:          { type: String }, // MCQ ya subjective
  status: {
    type: String,
    enum: ['correct', 'wrong', 'pending', 'skipped'],
    default: 'skipped',
  },
});

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  domain: {
    type: String,
    enum: ['web-dev', 'data-science', 'mobile'],
    required: true,
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  }],
  answers:  [answerSchema],
  score:    { type: Number, default: 0 },    // out of 15 MCQs
  status: {
    type: String,
    enum: ['in-progress', 'submitted', 'graded'],
    default: 'in-progress',
  },
  completedAt: { type: Date },
  timeTaken:   { type: Number, default: 0 }, // seconds mein
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);