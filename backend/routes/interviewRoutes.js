const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  startInterview,
  getFollowUp,
  submitInterview,
  uploadVideo: uploadVideoController, // ✅ renamed
  getMyInterviews,
} = require('../controllers/interviewController');

const { protect } = require('../middleware/authMiddleware');

// ================= VIDEO UPLOAD CONFIG =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/videos/'),
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
});

// ================= ROUTES =================
router.post('/start', protect, startInterview);
router.post('/followup', protect, getFollowUp);
router.post('/submit', protect, submitInterview);

// ✅ Correct upload route
router.post(
  '/upload-video',
  protect,
  upload.single('video'),
  uploadVideoController
);

router.get('/my', protect, getMyInterviews);

module.exports = router;