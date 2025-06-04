
// Re-export do hook otimizado
export { useDashboardMetricsOptimized as useDashboardMetrics } from './useDashboardMetricsOptimized';

// Export dos tipos
export type {
  FilterPeriod,
  DashboardMetrics,
  RevenueDataPoint,
  PopularService,
  UseDashboardMetricsReturn
} from './types';

// Note: Este arquivo agora usa a versão otimizada com cache e monitoramento
console.log('Dashboard metrics hook upgraded to optimized version with improved TypeScript types');
