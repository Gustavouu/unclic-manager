
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
