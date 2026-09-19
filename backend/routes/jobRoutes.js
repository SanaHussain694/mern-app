// backend/routes/jobRoutes.js
const express = require('express');
const router  = express.Router();
const {
  createJob, getAllJobs, getJobById, getMyJobs, deleteJob
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public — koi bhi dekh sakta hai
router.get('/',     getAllJobs);
router.get('/:id',  getJobById);

// Protected — login zaroori
router.get('/provider/my-jobs', protect, authorize('jobProvider', 'admin'), getMyJobs);
router.post('/',    protect, authorize('jobProvider', 'admin'), createJob);
router.delete('/:id', protect, authorize('jobProvider', 'admin'), deleteJob);

module.exports = router;