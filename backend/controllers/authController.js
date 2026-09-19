const User = require('../models/User');
const jwt = require('jsonwebtoken');

// JWT token banane ka helper function
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// ───────────────────────────────────────
// @route   POST /api/auth/register
// @access  Public
// ───────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Sab fields check karein
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Sab fields bharo' });
    }

    // 2. Email pehle se exist karta hai?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Yeh email pehle se registered hai' });
    }

    // 3. User banao — password User model ka pre('save') middleware
    //    automatically hash kar dega (Day 1-3 wala code)
    const user = await User.create({ name, email, password, role });

    // 4. Token banao aur bhejo
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ───────────────────────────────────────
// @route   POST /api/auth/login
// @access  Public
// ───────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email aur password dono bharo' });
    }

    // 1. User dhundho — password bhi select karo (model mein select:false tha)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Email ya password galat hai' });
    }

    // 2. Password match karo (User model ka method — Day 1-3 wala)
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ya password galat hai' });
    }

    // 3. Token generate karo
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register, login };