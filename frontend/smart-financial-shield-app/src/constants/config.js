/**
 * App Configuration
 */

const ENV = process.env;

const config = {
  // API Configuration
  apiUrl: ENV.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  apiTimeout: 30000,

  // App Configuration
  appName: ENV.EXPO_PUBLIC_APP_NAME || 'Smart Financial Shield',
  appVersion: '1.0.0',

  // Feature Flags
  features: {
    biometric: true,
    darkMode: true,
    notifications: true,
    offlineMode: true,
  },

  // Logging
  logging: {
    level: ENV.EXPO_PUBLIC_LOG_LEVEL || 'info',
    enabled: true,
  },

  // Cache
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutes
  },

  // Pagination
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
};

export default config;
