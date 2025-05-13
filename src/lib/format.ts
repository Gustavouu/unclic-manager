
/**
 * Utility functions for formatting values consistently across the application
 */

export interface CurrencyFormatOptions {
  locale?: string;
  currency?: string;
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Format a number as currency
 */
export const formatCurrency = (
  value: number | string | undefined | null,
  options: CurrencyFormatOptions = {}
): string => {
  const {
    locale = 'pt-BR',
    currency = 'BRL',
    notation = 'standard',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2
  } = options;

  // If value is undefined, null or NaN, return zero formatted
  if (value === undefined || value === null || (typeof value === 'number' && isNaN(value))) {
    value = 0;
  }

  // Convert string to number if needed
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation,
    minimumFractionDigits,
    maximumFractionDigits
  }).format(numberValue);
};

/**
 * Format a number with thousands separator
 */
export const formatNumber = (
  value: number | string | undefined | null,
  locale: string = 'pt-BR',
  options: Intl.NumberFormatOptions = {}
): string => {
  if (value === undefined || value === null || (typeof value === 'number' && isNaN(value))) {
    value = 0;
  }
  
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat(locale, options).format(numberValue);
};

/**
 * Format a date in the specified locale format
 */
export const formatDate = (
  date: Date | string | number | undefined | null,
  locale: string = 'pt-BR',
  options: Intl.DateTimeFormatOptions = { dateStyle: 'short' }
): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;
    
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

/**
 * Format a time value
 */
export const formatTime = (
  date: Date | string | number | undefined | null,
  locale: string = 'pt-BR'
): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;
    
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

/**
 * Format a date and time value
 */
export const formatDateTime = (
  date: Date | string | number | undefined | null,
  locale: string = 'pt-BR'
): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;
    
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(dateObj);
};

/**
 * Format a percentage value
 */
export const formatPercentage = (
  value: number | string | undefined | null,
  locale: string = 'pt-BR',
  digits: number = 1
): string => {
  if (value === undefined || value === null || (typeof value === 'number' && isNaN(value))) {
    value = 0;
  }
  
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(numberValue / 100);
};
