const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    psw: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    durationHours: {
      type: Number,
      required: true,
      min: 1,
      max: 24
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'InProgress', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
