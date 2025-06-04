
import { useQuery } from '@tanstack/react-query';
import { UnifiedDataService } from '@/services/unified/UnifiedDataService';
import { OptimizedCache, CacheKeys } from '@/services/cache/OptimizedCache';
import { useTenant } from '@/contexts/TenantContext';
import type { UnifiedClient, UnifiedAppointment } from '@/types/unified';

interface DashboardMetrics {
  totalClients: number;
  activeClients: number;
  todayAppointments: number;
  weekAppointments: number;
  monthRevenue: number;
  completionRate: number;
  upcomingAppointments: number;
  popularServices: Array<{ name: string; count: number }>;
}

export const useOptimizedDashboard = () => {
  const { businessId } = useTenant();
  const dataService = UnifiedDataService.getInstance();
  const cache = OptimizedCache.getInstance();

  const {
    data: metrics,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['dashboard-metrics', businessId],
    queryFn: async (): Promise<DashboardMetrics> => {
      if (!businessId) throw new Error('Business ID required');

      const cacheKey = CacheKeys.DASHBOARD_METRICS(businessId);
      const cached = cache.get<DashboardMetrics>(cacheKey);
      
      if (cached) return cached;

      // Fetch all data in parallel
      const [clients, appointments, services] = await Promise.all([
        dataService.getClients(businessId),
        dataService.getAppointments(businessId),
        dataService.getServices(businessId)
      ]);

      const today = new Date().toISOString().split('T')[0];
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - 1);

      const todayAppointments = appointments.filter(apt => apt.booking_date === today);
      const weekAppointments = appointments.filter(apt => 
        new Date(apt.booking_date) >= weekStart
      );
      const monthAppointments = appointments.filter(apt => 
        new Date(apt.booking_date) >= monthStart && apt.status === 'completed'
      );

      const monthRevenue = monthAppointments.reduce((sum, apt) => sum + apt.price, 0);
      const completionRate = appointments.length > 0 
        ? (appointments.filter(apt => apt.status === 'completed').length / appointments.length) * 100 
        : 0;

      // Calculate popular services
      const serviceCount = new Map<string, number>();
      appointments.forEach(apt => {
        const service = services.find(s => s.id === apt.service_id);
        if (service) {
          serviceCount.set(service.name, (serviceCount.get(service.name) || 0) + 1);
        }
      });

      const popularServices = Array.from(serviceCount.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

      const calculatedMetrics: DashboardMetrics = {
        totalClients: clients.length,
        activeClients: clients.filter(c => c.status === 'active').length,
        todayAppointments: todayAppointments.length,
        weekAppointments: weekAppointments.length,
        monthRevenue,
        completionRate: Math.round(completionRate),
        upcomingAppointments: appointments.filter(apt => 
          new Date(apt.booking_date) > new Date() && apt.status !== 'canceled'
        ).length,
        popularServices
      };

      // Cache for 5 minutes
      cache.set(cacheKey, calculatedMetrics, 5 * 60 * 1000);
      
      return calculatedMetrics;
    },
    enabled: !!businessId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  return {
    metrics: metrics || {
      totalClients: 0,
      activeClients: 0,
      todayAppointments: 0,
      weekAppointments: 0,
      monthRevenue: 0,
      completionRate: 0,
      upcomingAppointments: 0,
      popularServices: []
    },
    isLoading,
    error,
    refetch,
  };
};
