import api from './api';

/** User profile API service */
export const userService = {
  getProfile: async () => {
    const response = await api.get('/api/users/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/api/users/me', data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.patch('/api/users/me/password', data);
    return response.data;
  },
};
