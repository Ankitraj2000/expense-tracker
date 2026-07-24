import api from './api';

/** Reports API service */
export const reportService = {
  getMonthlyReport: async (year, month) => {
    const response = await api.get('/api/reports/monthly', { params: { year, month } });
    return response.data;
  },

  getYearlyReport: async (year) => {
    const response = await api.get('/api/reports/yearly', { params: { year } });
    return response.data;
  },
};
