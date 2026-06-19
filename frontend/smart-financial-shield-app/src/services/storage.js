/**
 * Storage Service
 * Handles local storage operations using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_PREFIX = 'sfs_'; // Smart Financial Shield prefix

export const storageService = {
  // Generic methods
  setItem: async (key, value) => {
    try {
      const serialized = JSON.stringify(value);
      await AsyncStorage.setItem(`${STORAGE_PREFIX}${key}`, serialized);
    } catch (error) {
      console.error('Storage Error:', error);
      throw error;
    }
  },

  getItem: async (key, defaultValue = null) => {
    try {
      const item = await AsyncStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage Error:', error);
      return defaultValue;
    }
  },

  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (error) {
      console.error('Storage Error:', error);
      throw error;
    }
  },

  clear: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const prefixedKeys = keys.filter((k) => k.startsWith(STORAGE_PREFIX));
      await AsyncStorage.multiRemove(prefixedKeys);
    } catch (error) {
      console.error('Storage Error:', error);
      throw error;
    }
  },

  // Specific methods
  setAuthToken: (token) => storageService.setItem('authToken', token),
  getAuthToken: () => storageService.getItem('authToken'),
  clearAuthToken: () => storageService.removeItem('authToken'),

  setUserProfile: (profile) => storageService.setItem('userProfile', profile),
  getUserProfile: () => storageService.getItem('userProfile'),

  setTransactions: (transactions) => storageService.setItem('transactions', transactions),
  getTransactions: () => storageService.getItem('transactions', []),

  setPreferences: (preferences) => storageService.setItem('preferences', preferences),
  getPreferences: () => storageService.getItem('preferences', {}),
};

export default storageService;
