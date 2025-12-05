import API from "../api/axiosInstance";

export const registerUser = (formData) => {
  return API.post("/auth/register", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const loginUser = (payload) => {
  return API.post("/auth/login", payload);
};

export const getProfile = () => {
  return API.get("/auth/me");
};
