import axios from 'axios';

/**
 * Configured Axios instance.
 * - Automatically attaches JWT from localStorage
 * - Handles 401 by clearing auth and redirecting to login
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ── Request Interceptor ───────────────────────────────────────

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('et_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ──────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale auth state and redirect to login
      localStorage.removeItem('et_token');
      localStorage.removeItem('et_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
