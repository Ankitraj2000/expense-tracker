import { format, parseISO, isValid } from 'date-fns';

// ── Currency Formatting ───────────────────────────────────────

/**
 * Format a number as currency (INR by default).
 * @param {number|string} amount
 * @param {string} currency - e.g. 'INR', 'USD'
 */
export function formatCurrency(amount, currency = 'INR') {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0.00';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(num);
}

/**
 * Format a number with thousand separators (no currency symbol).
 */
export function formatNumber(amount) {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
}

// ── Date Formatting ───────────────────────────────────────────

/**
 * Format a date string or Date object for display.
 * @param {string|Date} date
 * @param {string} formatStr - date-fns format string
 */
export function formatDate(date, formatStr = 'dd MMM yyyy') {
  if (!date) return '';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isValid(d) ? format(d, formatStr) : '';
  } catch {
    return '';
  }
}

/**
 * Format date for HTML input[type=date] (yyyy-MM-dd).
 */
export function toInputDate(date) {
  if (!date) return '';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isValid(d) ? format(d, 'yyyy-MM-dd') : '';
  } catch {
    return '';
  }
}

/**
 * Returns a relative string like "Today", "Yesterday", or "Jan 5, 2025".
 */
export function formatRelativeDate(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (format(d, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) return 'Today';
  if (format(d, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) return 'Yesterday';
  return format(d, 'MMM d, yyyy');
}

// ── Misc ─────────────────────────────────────────────────────

/**
 * Truncate a string to a max length with ellipsis.
 */
export function truncate(str, max = 40) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '...' : str;
}

/**
 * Returns the initials from a full name (up to 2 letters).
 */
export function getInitials(name = '') {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/**
 * Returns the percentage of a value relative to a total.
 */
export function percentage(value, total) {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
}
