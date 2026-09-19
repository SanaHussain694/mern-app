// backend/models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  // Job ki basic info
  title: {
    type: String,
    required: [true, 'Job title required hai'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Job description required hai'],
  },
  requiredSkills: [{ type: String }],  // ['React', 'Node.js']

  experience: {
    type: String,
    enum: ['fresher', '1-2 years', '2-5 years', '5+ years'],
    default: 'fresher',
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'remote', 'contract'],
    default: 'full-time',
  },

  // Kisne post kiya
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  isActive: { type: Boolean, default: true },

}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);