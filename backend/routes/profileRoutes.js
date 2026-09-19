// backend/routes/profileRoutes.js
const express  = require('express');
const router   = express.Router();
const { getProfile, updateProfile, uploadCV } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const upload   = require('../middleware/uploadMiddleware');

// ✅ Static routes MUST come before dynamic /:userId routes
// POST /api/profile/upload-cv
router.post('/upload-cv', protect, upload.single('cv'), uploadCV);

// GET  /api/profile/:userId
router.get('/:userId', protect, getProfile);

// PUT  /api/profile/:userId
router.put('/:userId', protect, updateProfile);

module.exports = router;