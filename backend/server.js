const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ================= UPLOAD FOLDER =================
const uploadPath = './uploads';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
  console.log('📁 uploads folder created');
}
app.use('/uploads', express.static(uploadPath));

// ================= ROUTES =================
const authRoutes         = require('./routes/authRoutes');
const profileRoutes      = require('./routes/profileRoutes');
const jobRoutes          = require('./routes/jobRoutes');
const questionRoutes     = require('./routes/questionRoutes');
const assessmentRoutes   = require('./routes/assessmentRoutes');
const behaviorLogRoutes  = require('./routes/behaviorLogRoutes');
const interviewRoutes    = require('./routes/interviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); // ✅ moved here
const adminRoutes        = require('./routes/adminRoutes');        // ✅ moved here

app.use('/api/auth',           authRoutes);
app.use('/api/profile',        profileRoutes);
app.use('/api/jobs',           jobRoutes);
app.use('/api/questions',      questionRoutes);
app.use('/api/assessments',    assessmentRoutes);
app.use('/api/behavior-logs',  behaviorLogRoutes);
app.use('/api/interviews',     interviewRoutes);
app.use('/api/notifications',  notificationRoutes); // ✅ moved here
app.use('/api/admin',          adminRoutes);         // ✅ moved here

// ================= HEALTH CHECK =================
app.get('/', (req, res) => {
  res.json({ message: '🚀 AI Recruitment API Running' });
});

// ================= DB =================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

// ================= START =================
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer();