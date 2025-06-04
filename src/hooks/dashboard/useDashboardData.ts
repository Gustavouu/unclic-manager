
// Unified dashboard data types for backward compatibility
export type FilterPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year';

export interface DashboardMetrics {
  totalClients: number;
  activeClients: number;
  totalAppointments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
  todayAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  canceledAppointments: number;
  averageTicket: number;
  retentionRate: number;
  growthRate: number;
  newClientsThisMonth: number;
  servicesCompleted: number;
}

export interface RevenueDataPoint {
  date: string;
  value: number;
}

export interface PopularService {
  id: string;
  name: string;
  count: number;
  percentage: number;
}

export interface DashboardStats {
  totalClients: number;
  monthlyRevenue: number;
  totalAppointments: number;
  averageRating: number;
  revenueData: RevenueDataPoint[];
  popularServices: PopularService[];
  nextAppointments: any[];
  retentionRate: number;
  newClients: number;
  completionRate: number;
  totalServices: number;
  totalRevenue: number;
}

// Re-export the main hook with improved typing
export { useDashboardMetrics } from './useDashboardMetrics';

// Legacy compatibility export
export { useDashboardMetrics as useDashboardData } from './useDashboardMetrics';
