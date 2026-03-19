const { validationResult } = require("express-validator");

const AppError = require("../utils/AppError");

const validateRequest = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array({ onlyFirstError: true });
    const errorMessage = errors.map((error) => error.msg).join(", ");
    return next(new AppError(errorMessage, 400));
  }

  return next();
};

module.exports = validateRequest;
