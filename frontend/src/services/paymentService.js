import { api } from "./api";

export const createPaymentIntentRequest = async (appointmentId) => {
  const response = await api.post(
    `/payments/appointments/${appointmentId}/intent`,
  );
  return response.data.data;
};

export const syncPaymentStatusRequest = async (paymentIntentId) => {
  const response = await api.post("/payments/confirm", { paymentIntentId });
  return response.data.data.payment;
};
