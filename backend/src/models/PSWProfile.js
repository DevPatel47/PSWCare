const mongoose = require("mongoose");

const { PSW_APPROVAL_STATUS } = require("../constants");

const availabilitySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      enum: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const certificationSchema = new mongoose.Schema(
  {
    fileKey: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const pswProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    skills: {
      type: [String],
      default: [],
    },
    experienceYears: {
      type: Number,
      min: 0,
      max: 60,
      default: 0,
    },
    hourlyRate: {
      type: Number,
      min: 0,
      required: true,
    },
    availability: {
      type: [availabilitySchema],
      default: [],
    },
    certifications: {
      type: [certificationSchema],
      default: [],
    },
    approvalStatus: {
      type: String,
      enum: Object.values(PSW_APPROVAL_STATUS),
      default: PSW_APPROVAL_STATUS.PENDING,
      index: true,
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

pswProfileSchema.index({ approvalStatus: 1, skills: 1, hourlyRate: 1 });

pswProfileSchema
  .virtual("approved")
  .get(function getApproved() {
    return this.approvalStatus === PSW_APPROVAL_STATUS.APPROVED;
  })
  .set(function setApproved(nextValue) {
    this.approvalStatus = nextValue
      ? PSW_APPROVAL_STATUS.APPROVED
      : PSW_APPROVAL_STATUS.PENDING;
  });

pswProfileSchema.set("toJSON", { virtuals: true });
pswProfileSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("PSWProfile", pswProfileSchema);
