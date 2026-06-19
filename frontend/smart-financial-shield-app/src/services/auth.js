/**
 * Authentication Service
 * Handles user authentication and authorization
 */

import apiService from './api';
import storageService from './storage';

export const authService = {
  register: async (email, password, name) => {
    try {
      const response = await apiService.register({
        email,
        password,
        name,
      });
      await storageService.setAuthToken(response.token);
      await storageService.setUserProfile(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await apiService.login({
        email,
        password,
      });
      await storageService.setAuthToken(response.token);
      await storageService.setUserProfile(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await storageService.clearAuthToken();
      await storageService.clear();
    } catch (error) {
      console.error('Logout Error:', error);
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const token = await storageService.getAuthToken();
      if (!token) {
        throw new Error('No auth token found');
      }
      const response = await apiService.refreshToken(token);
      await storageService.setAuthToken(response.token);
      return response;
    } catch (error) {
      throw error;
    }
  },

  isAuthenticated: async () => {
    const token = await storageService.getAuthToken();
    return !!token;
  },

  getCurrentUser: async () => {
    return await storageService.getUserProfile();
  },

  updateProfile: async (userData) => {
    try {
      const response = await apiService.updateUserProfile(userData);
      await storageService.setUserProfile(response);
      return response;
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      return await apiService.changePassword({
        currentPassword,
        newPassword,
      });
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
