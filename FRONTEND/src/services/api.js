import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5500/api',
  withCredentials: true,
});

/**
 * Slow-server indicator.
 * The backend runs on a free tier and sleeps when idle, so the first request
 * can take a while. Subscribers are notified when any request stays pending
 * longer than SLOW_REQUEST_MS, and again when no requests remain pending.
 */
const SLOW_REQUEST_MS = 2500;

const slowListeners = new Set();
let pendingCount = 0;
let slowTimer = null;
let isSlow = false;

const emitSlow = (value) => {
  if (isSlow === value) return;
  isSlow = value;
  slowListeners.forEach((listener) => listener(value));
};

export const onServerSlowChange = (listener) => {
  slowListeners.add(listener);
  return () => slowListeners.delete(listener);
};

const trackStart = () => {
  pendingCount += 1;
  if (!slowTimer && !isSlow) {
    slowTimer = setTimeout(() => emitSlow(true), SLOW_REQUEST_MS);
  }
};

const trackEnd = () => {
  pendingCount = Math.max(0, pendingCount - 1);
  if (pendingCount === 0) {
    clearTimeout(slowTimer);
    slowTimer = null;
    emitSlow(false);
  }
};

// Attach the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    trackStart();
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    trackEnd();
    return response;
  },
  async (error) => {
    const config = error.config;

    // One automatic retry for a failed first GET (network error only) —
    // this is the classic cold-start failure on a sleeping free-tier server.
    if (config && config.method === 'get' && !error.response && !config.__retried) {
      config.__retried = true;
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return api(config).finally(trackEnd);
    }

    trackEnd();
    return Promise.reject(error);
  }
);

export default api;
