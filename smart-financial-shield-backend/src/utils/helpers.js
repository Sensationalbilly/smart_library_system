/**
 * Helpers Utility
 * Common helper functions
 */

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const formatDate = (date) => {
  return new Date(date).toISOString();
};

const parseJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateId,
  formatDate,
  parseJSON
};
