import { api } from "./api";

export const getMyPswProfileRequest = async () => {
  const response = await api.get("/psw-profiles/me");
  return response.data.data.profile;
};

export const upsertMyPswProfileRequest = async (payload) => {
  const response = await api.post("/psw-profiles/me", payload);
  return response.data.data.profile;
};

export const uploadCertificationRequest = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/psw-profiles/me/certifications", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data.profile;
};
