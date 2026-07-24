import api from './api';

/**
 * Authentication API service.
 */
export const authService = {
  /**
   * Register a new user.
   * @param {{ name: string, email: string, password: string }} data
   */
  register: async (data) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  /**
   * Login with email and password.
   * @param {{ email: string, password: string }} credentials
   */
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  /**
   * Request password reset.
   * @param {{ email: string, newPassword: string }} data
   */
  forgotPassword: async (data) => {
    const response = await api.post('/api/auth/forgot-password', data);
    return response.data;
  },
};
