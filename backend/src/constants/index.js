const ROLES = {
  ADMIN: "admin",
  PSW: "psw",
  CLIENT: "client",
};

const PSW_APPROVAL_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

const APPOINTMENT_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

const PAYMENT_STATUS = {
  PENDING: "pending",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
  CANCELED: "canceled",
};

const ALLOWED_UPLOAD_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];
const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

module.exports = {
  ROLES,
  PSW_APPROVAL_STATUS,
  APPOINTMENT_STATUS,
  PAYMENT_STATUS,
  ALLOWED_UPLOAD_MIME_TYPES,
  MAX_UPLOAD_SIZE_BYTES,
};
