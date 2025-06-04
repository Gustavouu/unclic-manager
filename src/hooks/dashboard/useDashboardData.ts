
// Type definitions for backward compatibility with existing components
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
}

// Re-export the main hook
export { useDashboardMetrics } from './useDashboardMetrics';
