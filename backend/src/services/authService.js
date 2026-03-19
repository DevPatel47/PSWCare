const crypto = require("crypto");

const User = require("../models/User");
const AppError = require("../utils/AppError");
const { ROLES } = require("../constants");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const parseRefreshExpiry = () => {
  const refreshTtlDays = Number(process.env.JWT_REFRESH_TTL_DAYS || 7);
  return new Date(Date.now() + refreshTtlDays * 24 * 60 * 60 * 1000);
};

const buildAuthResponse = ({ user, accessToken, refreshToken }) => ({
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
  tokens: {
    accessToken,
    refreshToken,
  },
});

const registerUser = async ({ name, email, password, role }) => {
  const allowedRoles = [ROLES.PSW, ROLES.CLIENT];

  if (!allowedRoles.includes(role)) {
    throw new AppError("Role must be psw or client for self-registration", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  const user = new User({
    name,
    email,
    password,
    role,
  });
  await user.save();

  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });
  const refreshToken = generateRefreshToken({
    userId: user._id.toString(),
    role: user.role,
  });
  user.refreshTokenHash = hashToken(refreshToken);
  user.refreshTokenExpiresAt = parseRefreshExpiry();
  await user.save();

  return buildAuthResponse({ user, accessToken, refreshToken });
};

const loginUser = async ({ email, password, requiredRole = null }) => {
  const user = await User.findOne({ email }).select(
    "+password +refreshTokenHash +refreshTokenExpiresAt",
  );

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  if (requiredRole && user.role !== requiredRole) {
    throw new AppError("Admin credentials required", 403);
  }

  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });
  const refreshToken = generateRefreshToken({
    userId: user._id.toString(),
    role: user.role,
  });

  user.refreshTokenHash = hashToken(refreshToken);
  user.refreshTokenExpiresAt = parseRefreshExpiry();
  await user.save();

  return buildAuthResponse({ user, accessToken, refreshToken });
};

const refreshSession = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 401);
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new AppError("Invalid refresh token", 401);
  }

  const user = await User.findById(payload.sub).select(
    "+refreshTokenHash +refreshTokenExpiresAt",
  );
  if (!user || !user.isActive) {
    throw new AppError("User not found or inactive", 401);
  }

  const tokenHash = hashToken(refreshToken);
  if (!user.refreshTokenHash || user.refreshTokenHash !== tokenHash) {
    throw new AppError("Refresh token is no longer valid", 401);
  }

  if (!user.refreshTokenExpiresAt || user.refreshTokenExpiresAt < new Date()) {
    throw new AppError("Refresh token expired", 401);
  }

  const newAccessToken = generateAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });
  const newRefreshToken = generateRefreshToken({
    userId: user._id.toString(),
    role: user.role,
  });

  user.refreshTokenHash = hashToken(newRefreshToken);
  user.refreshTokenExpiresAt = parseRefreshExpiry();
  await user.save();

  return buildAuthResponse({
    user,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
};

const logoutUser = async (userId) => {
  const user = await User.findById(userId).select(
    "+refreshTokenHash +refreshTokenExpiresAt",
  );
  if (!user) {
    return;
  }

  user.refreshTokenHash = null;
  user.refreshTokenExpiresAt = null;
  await user.save();
};

module.exports = {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
};
