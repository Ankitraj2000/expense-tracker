import api from './api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/api/admin/stats');
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get('/api/admin/users');
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/api/admin/users/${id}`);
    return response.data;
  },

  toggleRole: async (id) => {
    const response = await api.post(`/api/admin/users/${id}/toggle-role`);
    return response.data;
  },

  getUserDetails: async (id) => {
    const response = await api.get(`/api/admin/users/${id}/details`);
    return response.data;
  },
};
