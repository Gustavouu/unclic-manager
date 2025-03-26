
import { CalendarRange, Clock, DollarSign, Users } from "lucide-react";

interface ServicePerformanceSectionProps {
  dateRange: string;
}

export function ServicePerformanceSection({ dateRange }: ServicePerformanceSectionProps) {
  // In a real application, we would use the dateRange to filter data
  console.log(`Loading service performance data for range: ${dateRange}`);
  
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
          <h3 className="text-2xl font-bold">523</h3>
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
          <h3 className="text-2xl font-bold">45 min</h3>
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
          <h3 className="text-2xl font-bold">R$ 85</h3>
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
          <h3 className="text-2xl font-bold">78%</h3>
        </div>
      </div>
    </div>
  );
}
