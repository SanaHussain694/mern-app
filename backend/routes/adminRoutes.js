// backend/routes/adminRoutes.js
const express = require('express');
const router  = express.Router();
const {
  getStats, getAllUsers, toggleSuspend,
  getCandidates, getCandidateDetail,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const adminOnly = [protect, authorize('admin')];

router.get('/stats',                      ...adminOnly, getStats);
router.get('/users',                      ...adminOnly, getAllUsers);
router.put('/users/:id/suspend',          ...adminOnly, toggleSuspend);
router.get('/candidates',                 ...adminOnly, getCandidates);
router.get('/candidates/:userId/detail',  ...adminOnly, getCandidateDetail);

module.exports = router;