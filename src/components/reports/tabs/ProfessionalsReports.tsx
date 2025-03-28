
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfessionalProductivityChart } from "../charts/ProfessionalProductivityChart";
import { ProfessionalRevenueChart } from "../charts/ProfessionalRevenueChart";
import { ProfessionalPerformanceSection } from "../sections/ProfessionalPerformanceSection";
import { ReportStatistics } from "@/hooks/reports/useReportsData";

interface ProfessionalsReportsProps {
  dateRange: string;
  stats: ReportStatistics;
}

export function ProfessionalsReports({ dateRange, stats }: ProfessionalsReportsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Performance da Equipe</CardTitle>
          <CardDescription>Análise de desempenho dos profissionais</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfessionalPerformanceSection dateRange={dateRange} stats={stats} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Produtividade</CardTitle>
          <CardDescription>Atendimentos por profissional</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfessionalProductivityChart dateRange={dateRange} stats={stats} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Receita Gerada</CardTitle>
          <CardDescription>Receita por profissional</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfessionalRevenueChart dateRange={dateRange} stats={stats} />
        </CardContent>
      </Card>
    </div>
  );
}
