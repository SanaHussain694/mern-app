// backend/routes/assessmentRoutes.js
const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  generateAssessment,
  submitAssessment,
  getMyAssessments,
} = require('../controllers/assessmentController');

// POST /api/assessments/generate — new assessment banao
router.post('/generate', protect, generateAssessment);

// POST /api/assessments/submit — assessment submit karo
router.post('/submit', protect, submitAssessment);

// GET /api/assessments/my — apni saari assessments dekho
router.get('/my', protect, getMyAssessments);

module.exports = router;