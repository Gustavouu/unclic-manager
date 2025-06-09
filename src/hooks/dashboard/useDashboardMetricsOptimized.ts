
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMultiTenant } from '@/contexts/MultiTenantContext';
import { CacheService, CacheKeys } from '@/services/cache/CacheService';
import { PerformanceMonitor } from '@/services/monitoring/PerformanceMonitor';
import { useContextualErrorHandler } from '@/hooks/useContextualErrorHandler';
import type { DashboardMetrics, RevenueDataPoint, PopularService, UseDashboardMetricsReturn } from './types';

export const useDashboardMetricsOptimized = (): UseDashboardMetricsReturn => {
  const { currentBusiness } = useMultiTenant();
  const cache = CacheService.getInstance();
  const performanceMonitor = PerformanceMonitor.getInstance();
  const errorHandler = useContextualErrorHandler('Dashboard');
  
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalClients: 0,
    activeClients: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    completedAppointments: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    revenueGrowth: 0,
    clientGrowth: 0,
    appointmentGrowth: 0,
    averageTicket: 0,
    retentionRate: 85,
    growthRate: 0,
    newClientsThisMonth: 0,
    servicesCompleted: 0,
  });

  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [popularServices, setPopularServices] = useState<PopularService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }, []);

  const fetchMetrics = useCallback(async () => {
    if (!currentBusiness?.id) {
      setIsLoading(false);
      setError('No business selected');
      return;
    }

    const cacheKey = `${CacheKeys.DASHBOARD_DATA}_${currentBusiness.id}`;
    
    try {
      setIsLoading(true);
      setError(null);

      // Check cache first
      const cachedData = cache.get<{
        metrics: DashboardMetrics;
        revenueData: RevenueDataPoint[];
        popularServices: PopularService[];
      }>(cacheKey);
      
      if (cachedData) {
        setMetrics(cachedData.metrics);
        setRevenueData(cachedData.revenueData);
        setPopularServices(cachedData.popularServices);
        setLastUpdate(new Date());
        setIsLoading(false);
        return;
      }

      const businessId = currentBusiness.id;
      const startTime = performance.now();
      
      // Get clients data
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('id, created_at, total_spent')
        .eq('business_id', businessId);

      if (clientsError) throw clientsError;

      // Get bookings data
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, status, price, booking_date, created_at, service_id')
        .eq('business_id', businessId);

      if (bookingsError) throw bookingsError;

      // Get services data
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('id, name')
        .eq('business_id', businessId);

      if (servicesError) throw servicesError;

      const endTime = performance.now();
      performanceMonitor.trackMetric('dashboard_query_time', endTime - startTime, {
        businessId,
        type: 'metrics_fetch'
      });

      // Calculate metrics
      const totalClients = clientsData?.length || 0;
      const activeClients = clientsData?.filter(c => c.total_spent > 0).length || 0;
      const totalAppointments = bookingsData?.length || 0;
      const completedAppointments = bookingsData?.filter(b => b.status === 'completed').length || 0;
      const todayAppointments = bookingsData?.filter(b => 
        new Date(b.booking_date).toDateString() === new Date().toDateString()
      ).length || 0;
      const pendingAppointments = bookingsData?.filter(b => b.status === 'scheduled').length || 0;

      const totalRevenue = bookingsData
        ?.filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (Number(b.price) || 0), 0) || 0;

      // Monthly revenue (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const monthlyRevenue = bookingsData
        ?.filter(b => 
          b.status === 'completed' && 
          new Date(b.booking_date) >= thirtyDaysAgo
        )
        .reduce((sum, b) => sum + (Number(b.price) || 0), 0) || 0;

      const averageTicket = completedAppointments > 0 ? totalRevenue / completedAppointments : 0;

      // Calculate growth metrics
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const currentPeriodClients = clientsData?.filter(c => 
        new Date(c.created_at) >= thirtyDaysAgo
      ).length || 0;

      const previousPeriodClients = clientsData?.filter(c => 
        new Date(c.created_at) >= sixtyDaysAgo && 
        new Date(c.created_at) < thirtyDaysAgo
      ).length || 0;

      const clientGrowth = previousPeriodClients > 0 
        ? ((currentPeriodClients - previousPeriodClients) / previousPeriodClients) * 100 
        : currentPeriodClients > 0 ? 100 : 0;

      // Revenue data for last 6 months
      const revenueDataPoints: RevenueDataPoint[] = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthRevenue = bookingsData
          ?.filter(b => 
            b.status === 'completed' && 
            new Date(b.booking_date) >= monthStart && 
            new Date(b.booking_date) <= monthEnd
          )
          .reduce((sum, b) => sum + (Number(b.price) || 0), 0) || 0;

        revenueDataPoints.push({
          date: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
          value: monthRevenue
        });
      }

      // Popular services
      const serviceBookings = new Map<string, number>();
      bookingsData?.forEach(booking => {
        if (booking.service_id) {
          serviceBookings.set(booking.service_id, (serviceBookings.get(booking.service_id) || 0) + 1);
        }
      });

      const popularServicesData: PopularService[] = Array.from(serviceBookings.entries())
        .map(([serviceId, count]) => {
          const service = servicesData?.find(s => s.id === serviceId);
          return {
            name: service?.name || 'Serviço não encontrado',
            count,
            percentage: totalAppointments > 0 ? (count / totalAppointments) * 100 : 0
          };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const newMetrics: DashboardMetrics = {
        totalClients,
        activeClients,
        totalRevenue,
        monthlyRevenue,
        completedAppointments,
        totalAppointments,
        todayAppointments,
        pendingAppointments,
        revenueGrowth: 0, // Could be calculated similarly to clientGrowth
        clientGrowth,
        appointmentGrowth: 0, // Could be calculated similarly
        averageTicket,
        retentionRate: 85, // Mock value - would need more complex calculation
        growthRate: clientGrowth,
        newClientsThisMonth: currentPeriodClients,
        servicesCompleted: completedAppointments,
      };

      // Cache the results
      const cacheData = {
        metrics: newMetrics,
        revenueData: revenueDataPoints,
        popularServices: popularServicesData
      };
      cache.set(cacheKey, cacheData, 5 * 60 * 1000);
      
      setMetrics(newMetrics);
      setRevenueData(revenueDataPoints);
      setPopularServices(popularServicesData);
      setLastUpdate(new Date());

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch metrics';
      
      errorHandler.handleError(error instanceof Error ? error : new Error(errorMessage), 'medium', {
        showToast: false
      });

      setError(errorMessage);
    } finally {
      setIsLoading(false);
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
    metrics,
    revenueData,
    popularServices,
    isLoading,
    error,
    formatCurrency,
    refreshMetrics,
    lastUpdate,
    // Expose individual metrics for backward compatibility
    totalClients: metrics.totalClients,
    totalRevenue: metrics.totalRevenue,
    completedAppointments: metrics.completedAppointments,
    totalAppointments: metrics.totalAppointments,
    revenueGrowth: metrics.revenueGrowth,
    clientGrowth: metrics.clientGrowth,
    appointmentGrowth: metrics.appointmentGrowth,
  };
};
