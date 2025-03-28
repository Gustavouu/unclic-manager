
import { Users, Clock, TrendingUp, DollarSign } from "lucide-react";
import { ReportStatistics } from "@/hooks/reports/useReportsData";

interface ProfessionalPerformanceSectionProps {
  dateRange: string;
  stats: ReportStatistics;
}

export function ProfessionalPerformanceSection({ dateRange, stats }: ProfessionalPerformanceSectionProps) {
  // Format currency values
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };
  
  // Calculate professional metrics
  const activeProfs = stats.professionalProductivity.length;
  const avgAppointments = stats.totalAppointments > 0 && activeProfs > 0 ? 
    Math.round(stats.totalAppointments / activeProfs) : 0;
  
  const conversionRate = 92; // Fixed value for demonstration
  
  const avgRevenue = stats.totalRevenue > 0 && activeProfs > 0 ? 
    Math.round(stats.totalRevenue / activeProfs) : 0;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="bg-primary/10 p-2 rounded-full">
            <Users className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Profissionais Ativos</p>
          <h3 className="text-2xl font-bold">{activeProfs}</h3>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="bg-amber-100 p-2 rounded-full">
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Média de Atendimentos</p>
          <h3 className="text-2xl font-bold">{avgAppointments}</h3>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="bg-green-100 p-2 rounded-full">
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
          <h3 className="text-2xl font-bold">{conversionRate}%</h3>
        </div>
      </div>
      
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="bg-blue-100 p-2 rounded-full">
            <DollarSign className="h-5 w-5 text-blue-500" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">Receita por Profissional</p>
          <h3 className="text-2xl font-bold">{formatCurrency(avgRevenue)}</h3>
        </div>
      </div>
    </div>
  );
}
