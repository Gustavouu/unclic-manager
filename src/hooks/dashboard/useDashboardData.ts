
// This file provides backward compatibility types
import type { UseDashboardMetricsReturn } from './types';

export type DashboardStats = UseDashboardMetricsReturn;

// Re-export the main hook under the old name for compatibility
export { useDashboardMetrics as useDashboardData } from './useDashboardMetrics';
