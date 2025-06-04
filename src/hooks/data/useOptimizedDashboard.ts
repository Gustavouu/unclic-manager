
import { useQuery } from '@tanstack/react-query';
import { useOptimizedTenant } from '@/contexts/OptimizedTenantContext';
import { UnifiedDataService } from '@/services/unified/UnifiedDataService';
import { CacheKeys } from '@/services/cache/OptimizedCache';

interface DashboardMetrics {
  todayAppointments: number;
  upcomingAppointments: number;
  activeClients: number;
  totalClients: number;
  monthRevenue: number;
  weekAppointments: number;
  completionRate: number;
  popularServices: Array<{ name: string; count: number }>;
}

export const useOptimizedDashboard = () => {
  const { businessId } = useOptimizedTenant();
  const dataService = UnifiedDataService.getInstance();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['dashboard-metrics', businessId],
    queryFn: async (): Promise<DashboardMetrics> => {
      if (!businessId) {
        return {
          todayAppointments: 0,
          upcomingAppointments: 0,
          activeClients: 0,
          totalClients: 0,
          monthRevenue: 0,
          weekAppointments: 0,
          completionRate: 0,
          popularServices: [],
        };
      }

      // Get data from unified service
      const [clients, appointments, services] = await Promise.all([
        dataService.getClients(businessId),
        dataService.getAppointments(businessId),
        dataService.getServices(businessId)
      ]);

      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointments.filter(apt => apt.booking_date === today).length;
      const upcomingAppointments = appointments.filter(apt => apt.booking_date > today).length;
      const activeClients = clients.filter(client => client.status === 'active').length;
      
      // Calculate popular services
      const serviceCount = appointments.reduce((acc, apt) => {
        if (apt.service_name) {
          acc[apt.service_name] = (acc[apt.service_name] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const popularServices = Object.entries(serviceCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        todayAppointments,
        upcomingAppointments,
        activeClients,
        totalClients: clients.length,
        monthRevenue: appointments.reduce((sum, apt) => sum + (apt.price || 0), 0),
        weekAppointments: appointments.filter(apt => {
          const aptDate = new Date(apt.booking_date);
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return aptDate >= weekAgo;
        }).length,
        completionRate: appointments.length > 0 
          ? Math.round((appointments.filter(apt => apt.status === 'completed').length / appointments.length) * 100)
          : 0,
        popularServices,
      };
    },
    enabled: !!businessId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    metrics: metrics || {
      todayAppointments: 0,
      upcomingAppointments: 0,
      activeClients: 0,
      totalClients: 0,
      monthRevenue: 0,
      weekAppointments: 0,
      completionRate: 0,
      popularServices: [],
    },
    isLoading,
  };
};
