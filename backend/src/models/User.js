const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },
    role: {
      type: String,
      enum: ['PSW', 'Client', 'Admin'],
      required: true,
      default: 'Client'
    },
    isApproved: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
