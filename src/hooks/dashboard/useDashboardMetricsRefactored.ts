
import { useState, useEffect, useCallback } from 'react';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { PerformanceMonitor } from '@/services/monitoring/PerformanceMonitor';
import { useDashboardCache } from './useDashboardCache';
import type {
  DashboardMetrics,
  RevenueDataPoint,
  PopularService,
  UseDashboardMetricsReturn
} from './types';

export const useDashboardMetricsRefactored = (): UseDashboardMetricsReturn => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalAppointments: 0,
    totalClients: 0,
    monthlyRevenue: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    activeClients: 0,
    newClientsThisMonth: 0,
    servicesCompleted: 0,
    averageTicket: 0,
    growthRate: 0,
    retentionRate: 0,
  });

  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [popularServices, setPopularServices] = useState<PopularService[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const { businessId } = useCurrentBusiness();
  const monitor = PerformanceMonitor.getInstance();
  const { getCachedData, setCachedData, invalidateCache, loadData } = useDashboardCache(businessId);

  const loadDashboardData = useCallback(async (): Promise<void> => {
    if (!businessId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('Loading refactored dashboard data for business:', businessId);

      // Tentar cache primeiro
      const cachedData = getCachedData(businessId);

      if (cachedData) {
        console.log('Using cached dashboard data');
        setMetrics(cachedData.metrics);
        setRevenueData(cachedData.revenueData);
        setPopularServices(cachedData.popularServices);
        setIsLoading(false);
        setLastUpdate(new Date());
        return;
      }

      // Carregar dados frescos do banco
      const data = await loadData(businessId);

      // Cache os dados
      setCachedData(businessId, data);

      setMetrics(data.metrics);
      setRevenueData(data.revenueData);
      setPopularServices(data.popularServices);
      setLastUpdate(new Date());

      monitor.trackMetric('dashboard_load_success', 1);

    } catch (err) {
      console.error('Error loading refactored dashboard data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados do dashboard';
      setError(errorMessage);
      monitor.trackMetric('dashboard_load_error', 1);
    } finally {
      setIsLoading(false);
    }
  }, [businessId, getCachedData, setCachedData, loadData, monitor]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const refreshData = useCallback((): void => {
    // Invalidar cache e recarregar
    if (businessId) {
      invalidateCache(businessId);
    }
    loadDashboardData();
  }, [businessId, invalidateCache, loadDashboardData]);

  const formatCurrency = useCallback((value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }, []);

  return {
    metrics,
    revenueData,
    popularServices,
    isLoading,
    error,
    lastUpdate,
    refreshData,
    formatCurrency,
  };
};
