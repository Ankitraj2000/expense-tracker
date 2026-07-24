/**
 * Form validation helpers for the Expense Tracker frontend.
 */

export const validators = {
  required: (value) => {
    if (value === null || value === undefined || String(value).trim() === '') {
      return 'This field is required';
    }
    return null;
  },

  email: (value) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return null;
  },

  minLength: (min) => (value) => {
    if (!value || value.length < min) return `Must be at least ${min} characters`;
    return null;
  },

  maxLength: (max) => (value) => {
    if (value && value.length > max) return `Must be at most ${max} characters`;
    return null;
  },

  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return null;
  },

  confirmPassword: (password) => (value) => {
    if (!value) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return null;
  },

  positiveAmount: (value) => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) return 'Amount must be greater than zero';
    if (num > 9999999999999) return 'Amount is too large';
    return null;
  },

  date: (value) => {
    if (!value) return 'Date is required';
    const d = new Date(value);
    if (isNaN(d.getTime())) return 'Please enter a valid date';
    return null;
  },
};

/**
 * Runs a list of validator functions against a value.
 * Returns the first error found, or null if valid.
 *
 * @param {any} value
 * @param {Function[]} fns - validator functions
 */
export function validate(value, fns) {
  for (const fn of fns) {
    const error = fn(value);
    if (error) return error;
  }
  return null;
}
