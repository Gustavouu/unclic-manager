
export type FilterPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year';

export interface DashboardMetrics {
  totalClients: number;
  activeClients: number;
  totalRevenue: number;
  monthlyRevenue: number;
  completedAppointments: number;
  totalAppointments: number;
  todayAppointments: number;
  pendingAppointments: number;
  revenueGrowth: number;
  clientGrowth: number;
  appointmentGrowth: number;
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
  name: string;
  count: number;
  percentage: number;
}

export interface UseDashboardMetricsReturn {
  metrics: DashboardMetrics;
  revenueData: RevenueDataPoint[];
  popularServices: PopularService[];
  isLoading: boolean;
  error: string | null;
  formatCurrency: (value: number) => string;
  refreshMetrics: () => void;
  lastUpdate: Date | null;
  totalClients: number;
  totalRevenue: number;
  completedAppointments: number;
  totalAppointments: number;
  revenueGrowth: number;
  clientGrowth: number;
  appointmentGrowth: number;
}
