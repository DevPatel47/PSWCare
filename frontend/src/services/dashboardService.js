import { api } from "./api";

export const generateDashboardRequest = async () => {
  const response = await api.post("/dashboard/generate");
  return response.data.data;
};
