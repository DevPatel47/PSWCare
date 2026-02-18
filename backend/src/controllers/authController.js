const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    throw new AppError('name, email, password, and role are required', 400);
  }

  if (password.length < 8) {
    throw new AppError('Password must be at least 8 characters long', 400);
  }

  const user = await authService.registerUser({ name, email, password, role });

  return res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: user
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('email and password are required', 400);
  }

  const result = await authService.loginUser({ email, password });

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result
  });
});

module.exports = {
  register,
  login
};
