
// Definição dos tipos utilizados no Dashboard
export type FilterPeriod = "today" | "week" | "month" | "quarter" | "year";

export interface DashboardWidgetProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

// Dashboard statistics interface to ensure consistent type usage
export interface DashboardStats {
  totalAppointments: number;
  completedAppointments: number;
  totalRevenue: number;
  newClients: number;
  clientsCount: number;
  todayAppointments: number;
  monthlyRevenue: number;
  monthlyServices: number;
  occupancyRate: number;
  popularServices: Array<{id: string, name: string, count: number}>;
  upcomingAppointments: any[];
  nextAppointments: any[];
  revenueData: Array<{date: string, value: number}>;
  retentionRate: number;
  newClientsCount: number;
  returningClientsCount: number;
}
