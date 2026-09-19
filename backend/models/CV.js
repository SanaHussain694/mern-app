// backend/models/CV.js  (or Profile.js — whichever you have)
const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree:    { type: String, trim: true },
  institute: { type: String, trim: true },
  year:      { type: String, trim: true },
});

const CVSchema = new mongoose.Schema(
  {
    // ✅ THIS was missing — causes the "Path user is not in schema" error
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'User',
      required: true,
      unique: true,   // one CV per user
    },

    phone: { type: String, trim: true, default: '' },
    city:  { type: String, trim: true, default: '' },
    bio:   { type: String, trim: true, default: '' },

    skills:    { type: [String], default: [] },
    education: { type: [educationSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CV', CVSchema);