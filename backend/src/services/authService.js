const bcrypt = require('bcrypt');

const User = require('../models/User');
const AppError = require('../utils/AppError');
const { generateToken } = require('../utils/jwt');

const registerUser = async ({ name, email, password, role }) => {
  const allowedRoles = ['PSW', 'Client'];

  if (!allowedRoles.includes(role)) {
    throw new AppError('Role must be PSW or Client for self-registration', 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email is already registered', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    isApproved: role === 'Client'
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isApproved: user.isApproved
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken({
    userId: user._id,
    role: user.role
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved
    }
  };
};

module.exports = {
  registerUser,
  loginUser
};
