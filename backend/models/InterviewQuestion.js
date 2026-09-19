// backend/models/InterviewQuestion.js
const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema({
  question: {
    type:     String,
    required: true,
    trim:     true,
  },
  domain: {
    type: String,
    enum: ['web-dev', 'data-science', 'mobile', 'behavioral', 'general'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  type: {
    type: String,
    enum: ['technical', 'behavioral', 'situational'],
    default: 'technical',
  },
  followUpQuestions: [{ type: String }],
  timeLimit: {
    type:    Number,
    default: 120, // seconds (2 minutes)
  },
}, { timestamps: true });

module.exports = mongoose.model('InterviewQuestion', interviewQuestionSchema);