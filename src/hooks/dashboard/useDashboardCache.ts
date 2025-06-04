
import { useCallback } from 'react';
import { CacheService, CacheKeys } from '@/services/cache/CacheService';
import { PerformanceMonitor } from '@/services/monitoring/PerformanceMonitor';
import { DashboardDataService } from '@/services/dashboard/DashboardDataService';
import type { DashboardData } from './types';

export const useDashboardCache = (businessId: string | undefined) => {
  const cache = CacheService.getInstance();
  const monitor = PerformanceMonitor.getInstance();
  const dataService = new DashboardDataService();

  const getCachedData = useCallback((businessId: string): DashboardData | null => {
    const cacheKey = CacheKeys.DASHBOARD_METRICS(businessId);
    const cachedData = cache.get<DashboardData>(cacheKey);
    
    if (cachedData) {
      monitor.trackMetric('dashboard_cache_hit', 1);
      return cachedData;
    }
    
    monitor.trackMetric('dashboard_cache_miss', 1);
    return null;
  }, [cache, monitor]);

  const setCachedData = useCallback((businessId: string, data: DashboardData): void => {
    const cacheKey = CacheKeys.DASHBOARD_METRICS(businessId);
    // Cache por 2 minutos
    cache.set(cacheKey, data, 2 * 60 * 1000);
  }, [cache]);

  const invalidateCache = useCallback((businessId: string): void => {
    const cacheKey = CacheKeys.DASHBOARD_METRICS(businessId);
    cache.delete(cacheKey);
  }, [cache]);

  const loadData = useCallback(async (businessId: string): Promise<DashboardData> => {
    return await monitor.measureAsync('dashboard_load', async () => {
      return await dataService.loadFreshData(businessId);
    });
  }, [monitor, dataService]);

  return {
    getCachedData,
    setCachedData,
    invalidateCache,
    loadData,
  };
};
