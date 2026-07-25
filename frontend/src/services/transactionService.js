import api from './api';

/**
 * Transactions API service — CRUD + filtering + pagination.
 */
export const transactionService = {
  /**
   * Fetch paginated transactions with optional filters.
   */
  getAll: async (params = {}) => {
    const response = await api.get('/api/transactions', { params });
    return response.data; // Spring Page object: { content, totalPages, totalElements, ... }
  },

  /**
   * Get a single transaction by ID.
   */
  getById: async (id) => {
    const response = await api.get(`/api/transactions/${id}`);
    return response.data;
  },

  /**
   * Create a new transaction.
   * @param {{ type, category, amount, description, date }} data
   */
  create: async (data) => {
    const response = await api.post('/api/transactions', data);
    return response.data;
  },

  /**
   * Update an existing transaction.
   */
  update: async (id, data) => {
    const response = await api.put(`/api/transactions/${id}`, data);
    return response.data;
  },

  /**
   * Delete a transaction by ID.
   */
  delete: async (id) => {
    const response = await api.delete(`/api/transactions/${id}`);
    return response.data;
  },

  /**
   * Delete ALL transactions for the current user (reset/clear all data).
   */
  deleteAll: async () => {
    const response = await api.delete('/api/transactions');
    return response.data;
  },
};
