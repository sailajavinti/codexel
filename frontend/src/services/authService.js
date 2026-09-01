import api from "../api/axios";

// Signup
export const signupUser = async (userData) => {
  const response = await api.post("/auth/signup", userData);

  return response.data;
};

// Login
export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);

  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};