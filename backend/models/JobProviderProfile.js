const mongoose = require('mongoose');

const jobProviderProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    industry: {
      type: String,
      // e.g. "IT", "Finance", "Healthcare"
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('JobProviderProfile', jobProviderProfileSchema);