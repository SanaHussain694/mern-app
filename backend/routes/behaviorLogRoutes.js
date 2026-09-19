// backend/routes/behaviorLogRoutes.js
const express = require('express');
const router  = express.Router();
const {
  logEvent, getLogsByAssessment, getLogsByUser
} = require('../controllers/behaviorLogController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/',                        protect, logEvent);
router.get('/:assessmentId',            protect, getLogsByAssessment);
router.get('/user/:userId',             protect, getLogsByUser);

module.exports = router;