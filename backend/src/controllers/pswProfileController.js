const PSWProfile = require("../models/PSWProfile");
const User = require("../models/User");
const { PSW_APPROVAL_STATUS, ROLES } = require("../constants");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { uploadCertification } = require("../services/s3Service");

const createOrUpdateMyProfile = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.PSW) {
    throw new AppError("Only PSWs can manage PSW profile", 403);
  }

  const {
    bio,
    skills = [],
    hourlyRate,
    availability = [],
    experienceYears,
  } = req.body;

  const existing = await PSWProfile.findOne({ user: req.user._id });
  if (existing) {
    existing.bio = bio ?? existing.bio;
    existing.skills = Array.isArray(skills) ? skills : existing.skills;
    if (typeof experienceYears !== "undefined") {
      existing.experienceYears = Number(experienceYears);
    }
    existing.hourlyRate = hourlyRate ?? existing.hourlyRate;
    existing.availability = Array.isArray(availability)
      ? availability
      : existing.availability;
    existing.approvalStatus = PSW_APPROVAL_STATUS.PENDING;
    await existing.save();

    return res.status(200).json({
      success: true,
      message: "PSW profile updated",
      data: { profile: existing },
    });
  }

  const profile = await PSWProfile.create({
    user: req.user._id,
    bio,
    skills,
    experienceYears: Number(experienceYears || 0),
    hourlyRate,
    availability,
    approvalStatus: PSW_APPROVAL_STATUS.PENDING,
  });

  return res.status(201).json({
    success: true,
    message: "PSW profile created",
    data: { profile },
  });
});

const uploadMyCertification = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.PSW) {
    throw new AppError("Only PSWs can upload certifications", 403);
  }

  if (!req.file) {
    throw new AppError("Certification file is required", 400);
  }

  const profile = await PSWProfile.findOne({ user: req.user._id });
  if (!profile) {
    throw new AppError("Create profile before uploading certifications", 400);
  }

  const uploaded = await uploadCertification({
    fileBuffer: req.file.buffer,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    userId: req.user._id.toString(),
  });

  profile.certifications.push(uploaded);
  profile.approvalStatus = PSW_APPROVAL_STATUS.PENDING;
  await profile.save();

  return res.status(200).json({
    success: true,
    message: "Certification uploaded",
    data: { profile },
  });
});

const getMyProfile = asyncHandler(async (req, res) => {
  if (req.user.role !== ROLES.PSW) {
    throw new AppError("Only PSWs can access this profile", 403);
  }

  const profile = await PSWProfile.findOne({ user: req.user._id }).populate(
    "user",
    "name email role",
  );

  if (!profile) {
    return res.status(200).json({
      success: true,
      data: { profile: null },
    });
  }

  return res.status(200).json({
    success: true,
    data: { profile },
  });
});

const listApprovedPSWs = asyncHandler(async (req, res) => {
  const { skill, minRate, maxRate, q, experience } = req.query;
  const query = { approvalStatus: PSW_APPROVAL_STATUS.APPROVED };

  if (skill) {
    query.skills = { $in: [skill] };
  }

  if (minRate || maxRate) {
    query.hourlyRate = {};
    if (minRate) {
      query.hourlyRate.$gte = Number(minRate);
    }
    if (maxRate) {
      query.hourlyRate.$lte = Number(maxRate);
    }
  }

  if (experience) {
    query.experienceYears = { $gte: Number(experience) };
  }

  const profiles = await PSWProfile.find(query)
    .populate("user", "name email role")
    .sort({ createdAt: -1 });

  const filteredProfiles = q
    ? profiles.filter((profile) => {
        const name = profile.user?.name || "";
        const skillsText = (profile.skills || []).join(" ");
        const haystack = `${name} ${skillsText}`.toLowerCase();
        return haystack.includes(String(q).toLowerCase());
      })
    : profiles;

  return res.status(200).json({
    success: true,
    data: { profiles: filteredProfiles },
  });
});

const getPSWProfileByUserId = asyncHandler(async (req, res) => {
  const profile = await PSWProfile.findOne({
    user: req.params.userId,
    approvalStatus: PSW_APPROVAL_STATUS.APPROVED,
  }).populate("user", "name email role");

  if (!profile) {
    throw new AppError("PSW profile not found", 404);
  }

  return res.status(200).json({
    success: true,
    data: { profile },
  });
});

const updateApprovalStatus = asyncHandler(async (req, res) => {
  const { status, rejectionReason = "" } = req.body;
  if (!Object.values(PSW_APPROVAL_STATUS).includes(status)) {
    throw new AppError("Invalid approval status", 400);
  }

  const profile = await PSWProfile.findById(req.params.profileId);
  if (!profile) {
    throw new AppError("PSW profile not found", 404);
  }

  if (
    status === PSW_APPROVAL_STATUS.APPROVED &&
    (!profile.certifications || profile.certifications.length === 0)
  ) {
    throw new AppError(
      "At least one certification is required before approval",
      400,
    );
  }

  profile.approvalStatus = status;
  profile.rejectionReason =
    status === PSW_APPROVAL_STATUS.REJECTED ? rejectionReason : "";
  await profile.save();

  await User.findByIdAndUpdate(profile.user, {
    $set: {
      isActive: true,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Approval status updated",
    data: { profile },
  });
});

const listPendingProfiles = asyncHandler(async (req, res) => {
  const profiles = await PSWProfile.find({
    approvalStatus: PSW_APPROVAL_STATUS.PENDING,
  })
    .populate("user", "name email role")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: { profiles },
  });
});

module.exports = {
  createOrUpdateMyProfile,
  uploadMyCertification,
  getMyProfile,
  listApprovedPSWs,
  getPSWProfileByUserId,
  updateApprovalStatus,
  listPendingProfiles,
};
