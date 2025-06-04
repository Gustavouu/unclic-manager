
// Redirect to the new dashboard metrics hook for consistency
export { useDashboardMetrics as useDashboardData } from './dashboard/useDashboardMetrics';

// Re-export types for backward compatibility
export type {
  DashboardMetrics,
  RevenueDataPoint,
  PopularService,
  FilterPeriod,
  UseDashboardMetricsReturn as DashboardStats,
} from './dashboard/types';
