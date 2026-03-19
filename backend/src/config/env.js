const requiredEnvironmentVariables = [
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
];

const hydrateLegacyEnvironment = () => {
  if (!process.env.JWT_ACCESS_SECRET && process.env.JWT_SECRET) {
    process.env.JWT_ACCESS_SECRET = process.env.JWT_SECRET;
  }

  if (!process.env.JWT_REFRESH_SECRET && process.env.JWT_SECRET) {
    process.env.JWT_REFRESH_SECRET = process.env.JWT_SECRET;
  }
};

const validateEnvironment = () => {
  hydrateLegacyEnvironment();

  const missingVariables = requiredEnvironmentVariables.filter(
    (key) => !process.env[key],
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(", ")}`,
    );
  }
};

module.exports = {
  validateEnvironment,
  hydrateLegacyEnvironment,
};
