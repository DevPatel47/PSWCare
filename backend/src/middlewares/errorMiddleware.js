const AppError = require("../utils/AppError");

const notFoundHandler = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const response = {
    success: false,
    message: error.message || "Internal server error",
  };

  if (process.env.NODE_ENV !== "production" && error.stack) {
    response.stack = error.stack;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
