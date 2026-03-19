const path = require("path");
const { randomUUID } = require("crypto");

const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");

const {
  ALLOWED_UPLOAD_MIME_TYPES,
  MAX_UPLOAD_SIZE_BYTES,
} = require("../constants");
const AppError = require("../utils/AppError");

const getS3Client = () => {
  if (
    !process.env.AWS_REGION ||
    !process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY
  ) {
    throw new AppError("AWS S3 credentials are not fully configured", 500);
  }

  return new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
};

const uploadCertification = async ({
  fileBuffer,
  originalName,
  mimeType,
  size,
  userId,
}) => {
  if (!ALLOWED_UPLOAD_MIME_TYPES.includes(mimeType)) {
    throw new AppError(
      "Unsupported file type. Allowed types: PDF, JPG, PNG",
      400,
    );
  }

  if (size > MAX_UPLOAD_SIZE_BYTES) {
    throw new AppError("File exceeds 5MB size limit", 400);
  }

  const extension = path.extname(originalName || "").toLowerCase();
  const objectKey = `certifications/${userId}/${randomUUID()}${extension}`;
  const s3Client = getS3Client();

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: objectKey,
      Body: fileBuffer,
      ContentType: mimeType,
    }),
  );

  const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${objectKey}`;

  return {
    fileKey: objectKey,
    fileUrl,
    mimeType,
    fileSize: size,
  };
};

module.exports = {
  uploadCertification,
};
