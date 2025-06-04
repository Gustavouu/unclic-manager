
import { useOptimizedDashboard } from '@/hooks/data/useOptimizedDashboard';
import type { UseDashboardMetricsReturn } from './types';

export const useDashboardMetrics = (): UseDashboardMetricsReturn => {
  const { metrics, isLoading } = useOptimizedDashboard();

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

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
    isLoading,
    error: null,
    formatCurrency,
  };
};
