const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
      unique: true
    },
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
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'cad',
      lowercase: true
    },
    stripePaymentIntentId: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Succeeded', 'Failed', 'Refunded'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Payment', paymentSchema);
