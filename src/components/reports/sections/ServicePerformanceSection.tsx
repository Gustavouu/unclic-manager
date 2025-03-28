
import { Users, Clock, DollarSign, CalendarRange } from "lucide-react";
import { ReportStatistics } from "@/hooks/reports/useReportsData";

interface ServicePerformanceSectionProps {
  dateRange: string;
  stats: ReportStatistics;
}

export function ServicePerformanceSection({ dateRange, stats }: ServicePerformanceSectionProps) {
  // Format the average duration in minutes
  const formattedDuration = Math.round(stats.averageDuration);
  
  // Format the average ticket value
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="bg-primary/10 p-2 rounded-full">
            <CalendarRange className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Total de Agendamentos</p>
          <h3 className="text-2xl font-bold">{stats.totalAppointments}</h3>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="bg-amber-100 p-2 rounded-full">
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Tempo Médio</p>
          <h3 className="text-2xl font-bold">{formattedDuration} min</h3>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="bg-green-100 p-2 rounded-full">
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Ticket Médio</p>
          <h3 className="text-2xl font-bold">{formatCurrency(stats.averagePrice)}</h3>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="bg-blue-100 p-2 rounded-full">
            <Users className="h-5 w-5 text-blue-500" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Taxa de Ocupação</p>
          <h3 className="text-2xl font-bold">{stats.occupancyRate}%</h3>
        </div>
      </div>
    </div>
  );
}
