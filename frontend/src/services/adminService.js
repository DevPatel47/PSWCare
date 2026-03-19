import { api } from "./api";

export const listUsersRequest = async (params = {}) => {
  const response = await api.get("/admin/users", { params });
  return response.data.data.users || [];
};

export const updateUserStatusRequest = async (userId, status) => {
  const response = await api.patch(`/admin/users/${userId}/status`, { status });
  return response.data.data.user;
};

export const listDisputesRequest = async (params = {}) => {
  const response = await api.get("/admin/disputes", { params });
  return response.data.data.disputes || [];
};

export const resolveDisputeRequest = async (disputeId, payload) => {
  const response = await api.patch(`/admin/disputes/${disputeId}`, payload);
  return response.data.data.dispute;
};
