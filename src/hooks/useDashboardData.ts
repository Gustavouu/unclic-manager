// Legacy hook - now redirects to the new unified dashboard metrics hook
// This file is kept for backward compatibility
export { useDashboardMetrics as useDashboardData } from './dashboard/useDashboardMetrics';

// Re-export types for backward compatibility
export type {
  FilterPeriod,
  DashboardMetrics,
  RevenueDataPoint,
  PopularService,
} from './dashboard/types';

// Keep the DashboardStats type from the original interface for full compatibility
export type { DashboardStats } from './dashboard/useDashboardData';

// Note: This hook has been refactored to use the new unified metrics system
console.warn('useDashboardData is deprecated. Please use useDashboardMetrics from @/hooks/dashboard/useDashboardMetrics');
