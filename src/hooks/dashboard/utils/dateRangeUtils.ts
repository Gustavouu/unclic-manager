
import { FilterPeriod } from '@/types/dashboard';

/**
 * Gets the date range based on the specified period
 */
export const getDateRange = (period: FilterPeriod) => {
  const today = new Date();
  const startDate = new Date();
  
  switch(period) {
    case 'today':
      // Just today
      return { start: today, end: today };
    case 'week':
      // Last 7 days
      startDate.setDate(today.getDate() - 7);
      return { start: startDate, end: today };
    case 'month':
      // Last 30 days
      startDate.setDate(today.getDate() - 30);
      return { start: startDate, end: today };
    case 'quarter':
      // Last 90 days
      startDate.setDate(today.getDate() - 90);
      return { start: startDate, end: today };
    case 'year':
      // Last 365 days
      startDate.setDate(today.getDate() - 365);
      return { start: startDate, end: today };
    default:
      // Default to month
      startDate.setDate(today.getDate() - 30);
      return { start: startDate, end: today };
  }
};

/**
 * Formats dates for database queries
 */
export const formatDateForQuery = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
