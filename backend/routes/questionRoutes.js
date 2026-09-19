// backend/routes/questionRoutes.js
const express = require('express');
const router  = express.Router();
const { bulkAdd, getQuestions } = require('../controllers/questionController');
const { protect, authorize }    = require('../middleware/authMiddleware');

router.get('/',        protect, getQuestions);
router.post('/bulk',   protect, authorize('admin'), bulkAdd);

module.exports = router;