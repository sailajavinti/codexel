import api from "../api/axios";

export const getProfile = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const updateProfile = async (name) => {
  const response = await api.put("/auth/update-profile", {
    name,
  });

  return response.data;
};