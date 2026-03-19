import { api, clearAccessToken, setAccessToken } from "./api";

export const registerRequest = async (payload) => {
  const response = await api.post("/auth/register", payload);
  const data = response.data.data;
  setAccessToken(data.accessToken);
  return data.user;
};

export const loginRequest = async (payload) => {
  const response = await api.post("/auth/login", payload);
  const data = response.data.data;
  setAccessToken(data.accessToken);
  return data.user;
};

export const adminLoginRequest = async (payload) => {
  const response = await api.post("/auth/admin/login", payload);
  const data = response.data.data;
  setAccessToken(data.accessToken);
  return data.user;
};

export const logoutRequest = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    clearAccessToken();
  }
};

export const meRequest = async () => {
  const response = await api.get("/auth/me");
  return response.data.data.user;
};
