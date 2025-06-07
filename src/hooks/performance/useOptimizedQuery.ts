
import { useCallback, useEffect, useRef } from 'react';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { RedisService, CacheKeys } from '@/services/cache/RedisService';
import { PerformanceMonitor } from '@/services/monitoring/PerformanceMonitor';
import { useDebouncedCallback } from '@/hooks/useDebounce';

interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  cacheKey?: { key: string; ttl: number };
  enableRedisCache?: boolean;
  enablePrefetch?: boolean;
  debounceMs?: number;
  trackPerformance?: boolean;
}

export function useOptimizedQuery<T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  options: OptimizedQueryOptions<T> = {}
): UseQueryResult<T> & { prefetch: () => Promise<void> } {
  const {
    cacheKey,
    enableRedisCache = true,
    enablePrefetch = false,
    debounceMs = 0,
    trackPerformance = true,
    ...queryOptions
  } = options;

  const redis = RedisService.getInstance();
  const monitor = PerformanceMonitor.getInstance();
  const lastQueryTime = useRef<number>(0);

  // Debounced query function
  const debouncedQueryFn = useDebouncedCallback(queryFn, debounceMs);

  // Enhanced query function with caching and monitoring
  const enhancedQueryFn = useCallback(async (): Promise<T> => {
    const startTime = performance.now();
    const queryKeyString = JSON.stringify(queryKey);

    try {
      // Try Redis cache first
      if (enableRedisCache && cacheKey) {
        const cached = await redis.get<T>(cacheKey.key);
        if (cached !== null) {
          if (trackPerformance) {
            monitor.trackMetric('query_cache_hit', 1, { queryKey: queryKeyString });
          }
          return cached;
        }
      }

      // Execute query
      const result = debounceMs > 0 ? await debouncedQueryFn() : await queryFn();
      
      // Cache the result
      if (enableRedisCache && cacheKey) {
        await redis.set(cacheKey.key, result, cacheKey.ttl);
      }

      // Track performance
      if (trackPerformance) {
        const duration = performance.now() - startTime;
        monitor.trackMetric('query_duration', duration, { queryKey: queryKeyString });
        monitor.trackMetric('query_cache_miss', 1, { queryKey: queryKeyString });
        lastQueryTime.current = Date.now();
      }

      return result;
    } catch (error) {
      if (trackPerformance) {
        const duration = performance.now() - startTime;
        monitor.trackMetric('query_error', 1, { 
          queryKey: queryKeyString,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration 
        });
      }
      throw error;
    }
  }, [queryKey, queryFn, debouncedQueryFn, cacheKey, enableRedisCache, trackPerformance, debounceMs]);

  // Prefetch function
  const prefetch = useCallback(async (): Promise<void> => {
    try {
      await enhancedQueryFn();
    } catch (error) {
      console.warn('Prefetch failed:', error);
    }
  }, [enhancedQueryFn]);

  // Auto-prefetch on mount if enabled
  useEffect(() => {
    if (enablePrefetch) {
      const timer = setTimeout(prefetch, 100); // Small delay to avoid blocking
      return () => clearTimeout(timer);
    }
  }, [enablePrefetch, prefetch]);

  const query = useQuery({
    queryKey,
    queryFn: enhancedQueryFn,
    staleTime: cacheKey ? cacheKey.ttl / 2 : 5 * 60 * 1000, // Half of TTL or 5 minutes
    gcTime: cacheKey ? cacheKey.ttl : 10 * 60 * 1000, // TTL or 10 minutes
    ...queryOptions
  });

  return {
    ...query,
    prefetch
  };
}

// Specialized hook for dashboard queries
export function useDashboardQuery<T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  businessId: string,
  options: Omit<OptimizedQueryOptions<T>, 'cacheKey'> = {}
) {
  const cacheKeyConfig = CacheKeys.DASHBOARD_METRICS(businessId);
  
  return useOptimizedQuery(queryKey, queryFn, {
    ...options,
    cacheKey: cacheKeyConfig,
    enablePrefetch: true,
    debounceMs: 300,
    trackPerformance: true
  });
}

// Hook for client list queries with smart caching
export function useClientListQuery<T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  businessId: string,
  filters: any,
  options: Omit<OptimizedQueryOptions<T>, 'cacheKey'> = {}
) {
  const filtersString = JSON.stringify(filters);
  const cacheKeyConfig = CacheKeys.CLIENT_LIST(businessId, filtersString);
  
  return useOptimizedQuery(queryKey, queryFn, {
    ...options,
    cacheKey: cacheKeyConfig,
    debounceMs: 500, // Longer debounce for filter changes
    trackPerformance: true
  });
}
