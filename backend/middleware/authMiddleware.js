// backend/middleware/authMiddleware.js
const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Login karein — token nahi mila' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ .select('-password') — password hash kabhi response mein na jaye
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Yeh user ab exist nahi karta' });
    }

    // ✅ req.user.id always works (Mongoose _id → id alias)
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token invalid hai' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expire ho gaya — dobara login karein' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Role-based access
const authorize = (...roles) => {
  return (req, res, next) => {
    // ✅ Guard: protect() pehle run hona chahiye
    if (!req.user) {
      return res.status(401).json({ message: 'Pehle authenticate karein' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Sirf ${roles.join(', ')} yeh kaam kar sakta hai`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };