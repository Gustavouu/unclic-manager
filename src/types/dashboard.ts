
export type FilterPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year';

export interface DashboardFilter {
  period: FilterPeriod;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
