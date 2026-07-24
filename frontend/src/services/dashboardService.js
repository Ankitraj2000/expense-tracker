import api from './api';

/** Dashboard API service */
export const dashboardService = {
  getDashboard: async () => {
    const response = await api.get('/api/dashboard');
    return response.data;
  },
};
