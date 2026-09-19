const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route example — middleware lagao
router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Role-based route example
router.get('/admin-only', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Sirf admin dekh sakta hai yeh' });
});

module.exports = router;