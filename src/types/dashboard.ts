
export interface DashboardStats {
  completedAppointments: number;
  totalRevenue: number;
  newClients: number;
  clientsCount: number;
  pendingAppointments: number;
  cancelledAppointments: number;
  averageTicket: number;
  retentionRate: number;
  growthRate: number;
  occupancyRate: number;
  todayAppointments: number;
  monthlyRevenue: number;
  totalAppointments: number;
  monthlyServices: number;
  newClientsCount: number;
  popularServices: Array<{ name: string; count: number; percentage: number }>;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  appointments: number;
}

export interface FinancialChartsProps {
  data: RevenueDataPoint[];
  loading: boolean;
}

export type FilterPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year';

export interface DashboardWidgetProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}
