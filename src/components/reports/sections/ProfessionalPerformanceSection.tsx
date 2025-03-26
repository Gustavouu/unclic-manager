
import { Users, Clock, TrendingUp, DollarSign } from "lucide-react";

interface ProfessionalPerformanceSectionProps {
  dateRange: string;
}

export function ProfessionalPerformanceSection({ dateRange }: ProfessionalPerformanceSectionProps) {
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
          <h3 className="text-2xl font-bold">12</h3>
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
          <h3 className="text-2xl font-bold">38</h3>
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
          <h3 className="text-2xl font-bold">92%</h3>
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
          <h3 className="text-2xl font-bold">R$ 3.850</h3>
        </div>
      </div>
    </div>
  );
}
