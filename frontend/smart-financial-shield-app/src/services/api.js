/**
 * API Service
 * Handles all API communication with the backend
 */

import axios from 'axios';
import config from '../constants/config';

const apiClient = axios.create({
  baseURL: config.apiUrl,
  timeout: config.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (request) => {
    console.log(`API Request: ${request.method.toUpperCase()} ${request.url}`);
    return request;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status}`);
    return response.data;
  },
  (error) => {
    console.error('Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Transaction endpoints
  createTransaction: (data) =>
    apiClient.post('/transactions', data),
  
  getTransactions: (params) =>
    apiClient.get('/transactions', { params }),
  
  getTransaction: (id) =>
    apiClient.get(`/transactions/${id}`),
  
  updateTransaction: (id, data) =>
    apiClient.put(`/transactions/${id}`, data),
  
  deleteTransaction: (id) =>
    apiClient.delete(`/transactions/${id}`),

  // Analytics endpoints
  getAnalytics: (period) =>
    apiClient.get(`/analytics?period=${period}`),

  // User endpoints
  getUserProfile: () =>
    apiClient.get('/user/profile'),

  updateUserProfile: (data) =>
    apiClient.put('/user/profile', data),

  // Scam Detection endpoints
  analyzeMessage: (data) =>
    apiClient.post('/scam-detection/analyze', data),

  reportMessage: (data) =>
    apiClient.post('/scam-detection/report', data),

  getScamCategories: () =>
    apiClient.get('/scam-detection/categories'),
};

export default apiService;
