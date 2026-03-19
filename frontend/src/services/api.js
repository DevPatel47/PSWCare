import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const ACCESS_TOKEN_KEY = "pswcares_access_token";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
};
export const clearAccessToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY);

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshInFlight = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshInFlight) {
      refreshInFlight = api.post("/auth/refresh").finally(() => {
        refreshInFlight = null;
      });
    }

    try {
      const refreshResponse = await refreshInFlight;
      const accessToken = refreshResponse?.data?.data?.accessToken;
      if (!accessToken) {
        clearAccessToken();
        return Promise.reject(error);
      }

      setAccessToken(accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      clearAccessToken();
      return Promise.reject(refreshError);
    }
  },
);
