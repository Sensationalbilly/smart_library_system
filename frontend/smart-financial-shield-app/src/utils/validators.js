/**
 * Validators Utility
 */

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

export const isValidPassword = (password) => {
  return password && password.length >= 8;
};

export const isValidAmount = (amount) => {
  return !isNaN(amount) && amount > 0;
};

export const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

export const isEmptyString = (str) => {
  return !str || str.trim().length === 0;
};

export const validateTransaction = (transaction) => {
  const errors = [];

  if (isEmptyString(transaction.description)) {
    errors.push('Description is required');
  }

  if (!isValidAmount(transaction.amount)) {
    errors.push('Amount must be a valid positive number');
  }

  if (!transaction.category) {
    errors.push('Category is required');
  }

  if (!transaction.type || !['income', 'expense'].includes(transaction.type)) {
    errors.push('Type must be either income or expense');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
