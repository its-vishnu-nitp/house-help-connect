import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5500/api",
  withCredentials: true,
});

// export const loginUser = (data) => api.post("/auth/login", data);
// export const registerUser = (data) => api.post("/auth/register", data);
// export const getHouseHelps = () => api.get("/helps");

export default api;
