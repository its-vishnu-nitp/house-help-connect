import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5500/api/auth/",
  withCredentials: true // 👈 REQUIRED for cookies (JWT)
});

export default api;
