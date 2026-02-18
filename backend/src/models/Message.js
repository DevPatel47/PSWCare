const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    status: {
      type: String,
      enum: ['Sent', 'Delivered', 'Read'],
      default: 'Sent'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Message', messageSchema);
