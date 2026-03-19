const authService = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { ROLES } = require("../constants");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: Number(
    process.env.REFRESH_COOKIE_MAX_AGE_MS || 7 * 24 * 60 * 60 * 1000,
  ),
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const result = await authService.registerUser({
    name,
    email: email.toLowerCase(),
    password,
    role: role.toLowerCase(),
  });

  res.cookie("pswcares_rt", result.tokens.refreshToken, cookieOptions);

  return res.status(201).json({
    success: true,
    message: "Registration successful",
    data: {
      user: result.user,
      accessToken: result.tokens.accessToken,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.loginUser({
    email: email.toLowerCase(),
    password,
  });

  res.cookie("pswcares_rt", result.tokens.refreshToken, cookieOptions);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: result.user,
      accessToken: result.tokens.accessToken,
    },
  });
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.loginUser({
    email: email.toLowerCase(),
    password,
    requiredRole: ROLES.ADMIN,
  });

  res.cookie("pswcares_rt", result.tokens.refreshToken, cookieOptions);

  return res.status(200).json({
    success: true,
    message: "Admin login successful",
    data: {
      user: result.user,
      accessToken: result.tokens.accessToken,
    },
  });
});

const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.pswcares_rt || req.body.refreshToken;
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 401);
  }

  const result = await authService.refreshSession(refreshToken);
  res.cookie("pswcares_rt", result.tokens.refreshToken, cookieOptions);

  return res.status(200).json({
    success: true,
    message: "Session refreshed",
    data: {
      user: result.user,
      accessToken: result.tokens.accessToken,
    },
  });
});

const logout = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new AppError("Unauthorized", 401);
  }

  await authService.logoutUser(req.user._id);
  res.clearCookie("pswcares_rt", cookieOptions);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

const me = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    },
  });
});

module.exports = {
  register,
  login,
  adminLogin,
  refresh,
  logout,
  me,
};
