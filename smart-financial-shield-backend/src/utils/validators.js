/**
 * Validators Utility
 * Input validation functions
 */

const validateTransaction = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate) {
    if (!data.amount || typeof data.amount !== 'number' || data.amount <= 0) {
      errors.push('Amount is required and must be a positive number');
    }
    if (!data.type || !['income', 'expense'].includes(data.type)) {
      errors.push('Type is required and must be either "income" or "expense"');
    }
  }

  if (data.amount !== undefined && (typeof data.amount !== 'number' || data.amount <= 0)) {
    errors.push('Amount must be a positive number');
  }

  if (data.type !== undefined && !['income', 'expense'].includes(data.type)) {
    errors.push('Type must be either "income" or "expense"');
  }

  if (data.category !== undefined && typeof data.category !== 'string') {
    errors.push('Category must be a string');
  }

  return {
    valid: errors.length === 0,
    error: errors.length > 0 ? errors.join('; ') : null
  };
};

const validateMessage = (message) => {
  const errors = [];

  if (!message) {
    errors.push('Message is required');
  }

  if (typeof message !== 'string') {
    errors.push('Message must be a string');
  }

  if (message && message.trim().length === 0) {
    errors.push('Message cannot be empty');
  }

  if (message && message.length > 5000) {
    errors.push('Message cannot exceed 5000 characters');
  }

  if (message && message.length < 10) {
    errors.push('Message must be at least 10 characters');
  }

  return {
    valid: errors.length === 0,
    error: errors.length > 0 ? errors.join('; ') : null
  };
};

module.exports = {
  validateTransaction,
  validateMessage
};
