const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { verifyAccessToken } = require("../utils/jwt");

const protect = asyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new AppError("Access token is required", 401);
  }

  const token = authorizationHeader.split(" ")[1];
  const payload = verifyAccessToken(token);

  const user = await User.findById(payload.sub).select(
    "-password -refreshTokenHash",
  );
  if (!user || !user.isActive) {
    throw new AppError("User not found or inactive", 401);
  }

  req.user = user;
  return next();
});

module.exports = {
  protect,
};
