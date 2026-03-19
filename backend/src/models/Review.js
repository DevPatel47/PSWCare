const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 600,
    },
  },
  {
    timestamps: true,
  },
);

reviewSchema.index({ appointment: 1, client: 1 }, { unique: true });
reviewSchema.index({ psw: 1, rating: 1 });

module.exports = mongoose.model("Review", reviewSchema);
