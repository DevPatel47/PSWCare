const mongoose = require('mongoose');

const pswProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500
    },
    hourlyRate: {
      type: Number,
      min: 0,
      required: true
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
      max: 60,
      default: 0
    },
    serviceAreas: {
      type: [String],
      default: []
    },
    skills: {
      type: [String],
      default: []
    },
    approvalStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('PSWProfile', pswProfileSchema);
