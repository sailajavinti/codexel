import api from "../api/axios";

export const getProfile = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const updateProfile = async (payload) => {
  const data = typeof payload === "string" ? { name: payload } : payload;
  const res = await api.put("/auth/update-profile", data);
  return res.data;
};