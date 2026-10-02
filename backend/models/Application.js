const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  seeker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job:    { type: mongoose.Schema.Types.ObjectId, ref: 'Job',  required: true },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'rejected'],
    default: 'applied'
  },
  assessment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' },
  interview:  { type: mongoose.Schema.Types.ObjectId, ref: 'Interview' },
  appliedAt:  { type: Date, default: Date.now }
});

// Ek seeker aik job par sirf ek baar apply kar sakta hai
applicationSchema.index({ seeker: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);