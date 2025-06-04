
// Re-export do hook otimizado
export { useDashboardMetricsOptimized as useDashboardMetrics } from './useDashboardMetricsOptimized';

// Manter compatibilidade com exports existentes
export type {
  FilterPeriod
} from './useDashboardMetricsOptimized';

// Note: Este arquivo agora usa a versão otimizada com cache e monitoramento
console.log('Dashboard metrics hook upgraded to optimized version with caching and performance monitoring');
