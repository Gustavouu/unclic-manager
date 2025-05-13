
/**
 * Utility functions for formatting values consistently across the app
 */

/**
 * Format a number as currency (BRL)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Format a date according to the specified format
 */
export const formatDate = (date: Date | string, format: 'short' | 'medium' | 'long' = 'medium'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: format === 'short' ? '2-digit' : 'long',
    year: format === 'long' ? 'numeric' : undefined
  };
  
  return new Intl.DateTimeFormat('pt-BR', options).format(dateObj);
};

/**
 * Format a date and time
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

/**
 * Format a phone number
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  
  // Remove non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Format according to Brazilian phone number patterns
  if (digits.length === 11) {
    // Mobile with area code (xx) xxxxx-xxxx
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7)}`;
  } else if (digits.length === 10) {
    // Landline with area code (xx) xxxx-xxxx
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 6)}-${digits.substring(6)}`;
  }
  
  // Return original if it doesn't match expected formats
  return phone;
};

/**
 * Format a percentage
 */
export const formatPercent = (value: number, decimalPlaces: number = 1): string => {
  return `${value.toFixed(decimalPlaces)}%`;
};

/**
 * Format a number with thousand separators
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};
