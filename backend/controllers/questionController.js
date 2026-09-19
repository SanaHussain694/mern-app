// backend/controllers/questionController.js
const Question = require('../models/Question');

// POST /api/questions/bulk
exports.bulkAdd = async (req, res) => {
  try {
    const { questions } = req.body;
    if (!questions?.length) {
      return res.status(400).json({ message: 'Questions array required!' });
    }
    const inserted = await Question.insertMany(questions);
    res.status(201).json({ success: true, count: inserted.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/questions?domain=web-dev
exports.getQuestions = async (req, res) => {
  try {
    const { domain } = req.query;
    const filter = domain ? { domain } : {};
    const questions = await Question.find(filter);
    res.json({ success: true, count: questions.length, questions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};