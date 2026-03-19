const mongoose = require("mongoose");

const { APPOINTMENT_STATUS } = require("../constants");

const rescheduleHistorySchema = new mongoose.Schema(
  {
    previousStart: {
      type: Date,
      required: true,
    },
    previousEnd: {
      type: Date,
      required: true,
    },
    newStart: {
      type: Date,
      required: true,
    },
    newEnd: {
      type: Date,
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const appointmentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    psw: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scheduledStart: {
      type: Date,
      required: true,
    },
    scheduledEnd: {
      type: Date,
      required: true,
    },
    date: {
      type: String,
      trim: true,
      default: "",
    },
    time: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: Object.values(APPOINTMENT_STATUS),
      default: APPOINTMENT_STATUS.PENDING,
      index: true,
    },
    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    rescheduleHistory: {
      type: [rescheduleHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

appointmentSchema.index({ client: 1, psw: 1, scheduledStart: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
