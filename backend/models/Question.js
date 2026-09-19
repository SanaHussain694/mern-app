// backend/models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['MCQ', 'subjective'],
    required: true,
  },
  options: [{ type: String }], // MCQ ke liye 4 options
  correctAnswer: {
    type: String,   // MCQ: correct option, subjective: sample answer
    required: true,
  },
  domain: {
    type: String,
    enum: ['web-dev', 'data-science', 'mobile'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);