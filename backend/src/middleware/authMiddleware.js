const jwt = require('jsonwebtoken');

const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw new AppError('Access token is missing', 401);
  }

  const token = authorizationHeader.split(' ')[1];

  if (!process.env.JWT_SECRET) {
    throw new AppError('JWT secret is not configured', 500);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AppError('Invalid or expired token', 401);
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new AppError('User associated with this token no longer exists', 401);
  }

  req.user = {
    id: user._id,
    role: user.role,
    email: user.email,
    name: user.name
  };

  next();
});

module.exports = { protect };
