const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: String,       // e.g. "BS Computer Science"
  institution: String,  // e.g. "FAST Lahore"
  year: Number,         // e.g. 2023
});

const experienceSchema = new mongoose.Schema({
  title: String,        // e.g. "Frontend Developer"
  company: String,
  from: Date,
  to: Date,
  current: { type: Boolean, default: false },
  description: String,
});

const jobSeekerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // ek user ka ek hi profile
    },
    skills: [String],             // e.g. ["React", "Node.js", "MongoDB"]
    education: [educationSchema],
    experience: [experienceSchema],
    cvUrl: {
      type: String,
      default: '',              // Cloudinary ya S3 link yahan aayega
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('JobSeekerProfile', jobSeekerProfileSchema);