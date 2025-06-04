
export type FilterPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year';

export interface DashboardMetrics {
  totalAppointments: number;
  totalClients: number;
  monthlyRevenue: number;
  todayAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  activeClients: number;
  newClientsThisMonth: number;
  servicesCompleted: number;
  averageTicket: number;
  growthRate: number;
  retentionRate: number;
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

export interface AppointmentData {
  id: string;
  booking_date: string;
  status: string;
  price: number | null;
  created_at: string;
}

export interface ClientData {
  id: string;
  status: string;
  created_at: string;
}

export interface SupabaseResponse<T> {
  data: T[] | null;
  error: {
    message: string;
    code?: string;
    details?: string;
  } | null;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  revenueData: RevenueDataPoint[];
  popularServices: PopularService[];
}

export interface UseDashboardMetricsReturn {
  metrics: DashboardMetrics;
  revenueData: RevenueDataPoint[];
  popularServices: PopularService[];
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  refreshData: () => void;
  formatCurrency: (value: number) => string;
}
