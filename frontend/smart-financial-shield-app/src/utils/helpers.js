/**
 * Helper Functions
 */

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const groupBy = (array, key) => {
  return array.reduce((result, obj) => {
    const group = obj[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(obj);
    return result;
  }, {});
};

export const sortBy = (array, key, ascending = true) => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) {
      return ascending ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return ascending ? 1 : -1;
    }
    return 0;
  });
};

export const sumBy = (array, key) => {
  return array.reduce((sum, obj) => sum + (obj[key] || 0), 0);
};

export const averageBy = (array, key) => {
  const total = sumBy(array, key);
  return array.length > 0 ? total / array.length : 0;
};

export const removeDuplicates = (array, key) => {
  const seen = new Set();
  return array.filter((obj) => {
    const value = obj[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

export const chunk = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};
