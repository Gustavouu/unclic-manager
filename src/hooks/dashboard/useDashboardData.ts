
// Tipos para compatibilidade com o hook legacy
export interface DashboardStats {
  totalAppointments: number;
  completedAppointments: number;
  totalRevenue: number;
  newClients: number;
  clientsCount: number;
  averageTicket: number;
  retentionRate: number;
  popularServices: PopularService[];
  revenueData: RevenueDataPoint[];
  appointmentsToday: number;
  pendingAppointments: number;
  cancellationRate: number;
  cancelledAppointments: number;
  growthRate: number;
  occupancyRate: number;
  todayAppointments: number;
  monthlyRevenue: number;
  averageRating: number;
  totalClients: number;
  monthlyServices: number;
  newClientsCount: number;
}

export interface PopularService {
  id: string;
  name: string;
  count: number;
  percentage: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  appointments: number;
}

export type FilterPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year';

// Re-export do hook otimizado para compatibilidade
export { useDashboardMetrics as useDashboardData } from './useDashboardMetrics';
