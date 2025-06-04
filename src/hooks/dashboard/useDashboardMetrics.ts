
import { useDashboardMetricsRefactored } from './useDashboardMetricsRefactored';
import type { UseDashboardMetricsReturn } from './types';

export const useDashboardMetrics = (): UseDashboardMetricsReturn => {
  return useDashboardMetricsRefactored();
};
