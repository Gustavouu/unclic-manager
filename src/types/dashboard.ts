
export type FilterPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year';

export interface DashboardFilter {
  period: FilterPeriod;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Add the DashboardWidgetProps interface
export interface DashboardWidgetProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}
