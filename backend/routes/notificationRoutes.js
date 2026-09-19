// backend/routes/notificationRoutes.js
const express = require('express');
const router  = express.Router();
const {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllRead,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/',                   protect, createNotification);
router.get('/:userId',             protect, getUserNotifications);
router.put('/read-all',            protect, markAllRead);
router.put('/:id/read',            protect, markAsRead);

module.exports = router;