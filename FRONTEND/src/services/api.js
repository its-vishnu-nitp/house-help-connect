import axios from 'axios';

const api = axios.create({
  // This tells Vite to use the Vercel variable in production, and localhost in development
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5500/api',
  withCredentials: true, 
});

export default api;