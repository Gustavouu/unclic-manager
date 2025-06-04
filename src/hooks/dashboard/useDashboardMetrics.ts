
import { useOptimizedDashboard } from '@/hooks/data/useOptimizedDashboard';
import type { UseDashboardMetricsReturn, RevenueDataPoint, PopularService } from './types';

export const useDashboardMetrics = (): UseDashboardMetricsReturn => {
  const { metrics, isLoading } = useOptimizedDashboard();

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Generate mock revenue data for the last 6 months
  const revenueData: RevenueDataPoint[] = [];
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    revenueData.push({
      date: date.toLocaleDateString('pt-BR', { month: 'short' }),
      value: Math.floor(Math.random() * 5000) + 2000
    });
  }

  // Generate mock popular services data
  const popularServices: PopularService[] = metrics.popularServices.map((service, index) => ({
    id: `service-${index}`,
    name: service.name,
    count: service.count,
    percentage: (service.count / Math.max(metrics.todayAppointments + metrics.upcomingAppointments, 1)) * 100
  }));

  return {
    metrics: {
      totalAppointments: metrics.todayAppointments + metrics.upcomingAppointments,
      totalClients: metrics.totalClients,
      monthlyRevenue: metrics.monthRevenue,
      todayAppointments: metrics.todayAppointments,
      pendingAppointments: metrics.upcomingAppointments,
      completedAppointments: Math.floor(metrics.todayAppointments * (metrics.completionRate / 100)),
      activeClients: metrics.activeClients,
      newClientsThisMonth: Math.floor(metrics.totalClients * 0.1), // Placeholder
      servicesCompleted: Math.floor(metrics.todayAppointments * (metrics.completionRate / 100)),
      averageTicket: metrics.monthRevenue / Math.max(metrics.todayAppointments + metrics.upcomingAppointments, 1),
      growthRate: 15, // Placeholder
      retentionRate: 85, // Placeholder
    },
    revenueData,
    popularServices,
    isLoading,
    error: null,
    formatCurrency,
  };
};
