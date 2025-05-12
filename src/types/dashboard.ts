
// Definição dos tipos utilizados no Dashboard
export type FilterPeriod = "today" | "week" | "month" | "quarter" | "year";

export interface DashboardWidgetProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}
