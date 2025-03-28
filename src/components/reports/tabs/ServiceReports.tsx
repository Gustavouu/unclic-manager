
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicePopularityChart } from "../charts/ServicePopularityChart";
import { ServiceOccupancyChart } from "../charts/ServiceOccupancyChart";
import { ServicePerformanceSection } from "../sections/ServicePerformanceSection";
import { ReportStatistics } from "@/hooks/reports/useReportsData";

interface ServiceReportsProps {
  dateRange: string;
  stats: ReportStatistics;
}

export function ServiceReports({ dateRange, stats }: ServiceReportsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Performance de Serviços</CardTitle>
          <CardDescription>Análise de desempenho dos serviços oferecidos</CardDescription>
        </CardHeader>
        <CardContent>
          <ServicePerformanceSection dateRange={dateRange} stats={stats} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Popularidade de Serviços</CardTitle>
          <CardDescription>Serviços mais agendados</CardDescription>
        </CardHeader>
        <CardContent>
          <ServicePopularityChart dateRange={dateRange} stats={stats} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Taxa de Ocupação</CardTitle>
          <CardDescription>Ocupação por horário e dia da semana</CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceOccupancyChart dateRange={dateRange} />
        </CardContent>
      </Card>
    </div>
  );
}
