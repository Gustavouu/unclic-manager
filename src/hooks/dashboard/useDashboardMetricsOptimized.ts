
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMultiTenant } from '@/contexts/MultiTenantContext';
import { CacheService, CacheKeys } from '@/services/cache/CacheService';
import { PerformanceMonitor } from '@/services/monitoring/PerformanceMonitor';
import { useContextualErrorHandler } from '@/hooks/useContextualErrorHandler';

interface DashboardMetrics {
  totalClients: number;
  totalRevenue: number;
  completedAppointments: number;
  totalAppointments: number;
  revenueGrowth: number;
  clientGrowth: number;
  appointmentGrowth: number;
  isLoading: boolean;
  error: string | null;
}

export const useDashboardMetricsOptimized = () => {
  const { currentBusiness } = useMultiTenant();
  const cache = CacheService.getInstance();
  const performanceMonitor = PerformanceMonitor.getInstance();
  const errorHandler = useContextualErrorHandler('Dashboard');
  
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalClients: 0,
    totalRevenue: 0,
    completedAppointments: 0,
    totalAppointments: 0,
    revenueGrowth: 0,
    clientGrowth: 0,
    appointmentGrowth: 0,
    isLoading: true,
    error: null
  });

  const fetchMetrics = useCallback(async () => {
    if (!currentBusiness?.id) {
      setMetrics(prev => ({ ...prev, isLoading: false, error: 'No business selected' }));
      return;
    }

    const cacheKey = `${CacheKeys.DASHBOARD_DATA}_${currentBusiness.id}`;
    
    try {
      setMetrics(prev => ({ ...prev, isLoading: true, error: null }));

      // Check cache first
      const cachedData = cache.get<DashboardMetrics>(cacheKey);
      if (cachedData) {
        setMetrics({ ...cachedData, isLoading: false });
        return;
      }

      const businessId = currentBusiness.id;
      
      // Fetch current period metrics
      const startTime = performance.now();
      
      // Get total clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('id, created_at, total_spent')
        .eq('business_id', businessId);

      if (clientsError) throw clientsError;

      // Get bookings data
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, status, price, booking_date, created_at')
        .eq('business_id', businessId);

      if (bookingsError) throw bookingsError;

      const endTime = performance.now();
      performanceMonitor.trackMetric('dashboard_query_time', endTime - startTime, {
        businessId,
        type: 'metrics_fetch'
      });

      // Calculate metrics
      const totalClients = clientsData?.length || 0;
      const totalAppointments = bookingsData?.length || 0;
      const completedAppointments = bookingsData?.filter(b => b.status === 'completed').length || 0;
      const totalRevenue = bookingsData
        ?.filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (Number(b.price) || 0), 0) || 0;

      // Calculate growth metrics (comparing to previous period)
      const currentDate = new Date();
      const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(currentDate.getTime() - 60 * 24 * 60 * 60 * 1000);

      // Current period (last 30 days)
      const currentPeriodClients = clientsData?.filter(c => 
        new Date(c.created_at) >= thirtyDaysAgo
      ).length || 0;

      const currentPeriodBookings = bookingsData?.filter(b => 
        new Date(b.booking_date) >= thirtyDaysAgo
      ).length || 0;

      const currentPeriodRevenue = bookingsData
        ?.filter(b => 
          b.status === 'completed' && 
          new Date(b.booking_date) >= thirtyDaysAgo
        )
        .reduce((sum, b) => sum + (Number(b.price) || 0), 0) || 0;

      // Previous period (30-60 days ago)
      const previousPeriodClients = clientsData?.filter(c => 
        new Date(c.created_at) >= sixtyDaysAgo && 
        new Date(c.created_at) < thirtyDaysAgo
      ).length || 0;

      const previousPeriodBookings = bookingsData?.filter(b => 
        new Date(b.booking_date) >= sixtyDaysAgo && 
        new Date(b.booking_date) < thirtyDaysAgo
      ).length || 0;

      const previousPeriodRevenue = bookingsData
        ?.filter(b => 
          b.status === 'completed' && 
          new Date(b.booking_date) >= sixtyDaysAgo && 
          new Date(b.booking_date) < thirtyDaysAgo
        )
        .reduce((sum, b) => sum + (Number(b.price) || 0), 0) || 0;

      // Calculate growth percentages
      const clientGrowth = previousPeriodClients > 0 
        ? ((currentPeriodClients - previousPeriodClients) / previousPeriodClients) * 100 
        : currentPeriodClients > 0 ? 100 : 0;

      const appointmentGrowth = previousPeriodBookings > 0 
        ? ((currentPeriodBookings - previousPeriodBookings) / previousPeriodBookings) * 100 
        : currentPeriodBookings > 0 ? 100 : 0;

      const revenueGrowth = previousPeriodRevenue > 0 
        ? ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100 
        : currentPeriodRevenue > 0 ? 100 : 0;

      const newMetrics: DashboardMetrics = {
        totalClients,
        totalRevenue,
        completedAppointments,
        totalAppointments,
        revenueGrowth,
        clientGrowth,
        appointmentGrowth,
        isLoading: false,
        error: null
      };

      // Cache the results for 5 minutes
      cache.set(cacheKey, newMetrics, 5 * 60 * 1000);
      
      setMetrics(newMetrics);

      performanceMonitor.trackMetric('dashboard_metrics_success', 1, { businessId });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch metrics';
      
      errorHandler.handleError(error instanceof Error ? error : new Error(errorMessage), 'medium', {
        showToast: false // Don't show toast for background operations
      });

      setMetrics(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      performanceMonitor.trackMetric('dashboard_metrics_error', 1, { 
        businessId: currentBusiness?.id,
        error: errorMessage 
      });
    }
  }, [currentBusiness?.id, cache, performanceMonitor, errorHandler]);

  const refreshMetrics = useCallback(() => {
    if (currentBusiness?.id) {
      const cacheKey = `${CacheKeys.DASHBOARD_DATA}_${currentBusiness.id}`;
      cache.invalidate(cacheKey);
      fetchMetrics();
    }
  }, [currentBusiness?.id, cache, fetchMetrics]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    ...metrics,
    refreshMetrics,
    isLoading: metrics.isLoading
  };
};
