
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, PieChart } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { useAdvancedReports } from '@/hooks/reports/useAdvancedReports';
import { ReportsKPICards } from './ReportsKPICards';
import { ReportsDateFilter } from './ReportsDateFilter';
import { HourlyDistributionChart } from './charts/HourlyDistributionChart';
import { PaymentMethodsChart } from './charts/PaymentMethodsChart';
import { ServicesTab } from './tabs/ServicesTab';
import { ProfessionalsTab } from './tabs/ProfessionalsTab';
import { ReportExporter } from './ReportExporter';

export const AdvancedReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });

  const { data, isLoading, error } = useAdvancedReports({
    from: dateRange?.from || new Date(),
    to: dateRange?.to || new Date()
  });

  const exportReport = (format: 'pdf' | 'excel') => {
    console.log(`Exportando relatório como ${format}`);
    // Implementar exportação
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erro ao carregar relatórios: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios Avançados</h1>
          <p className="text-gray-600">Análise detalhada do desempenho do seu negócio</p>
        </div>
        
        <ReportsDateFilter
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onExport={exportReport}
        />
      </div>

      {/* KPIs Cards */}
      <ReportsKPICards data={data} />

      {/* Detailed Reports */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="professionals">Profissionais</TabsTrigger>
          <TabsTrigger value="export">
            <BarChart3 className="h-4 w-4 mr-2" />
            Exportar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <HourlyDistributionChart data={data.hourlyDistribution} />
            <PaymentMethodsChart data={data.paymentMethods} />
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <ServicesTab 
            popularServices={data.popularServices}
            totalRevenue={data.totalRevenue}
          />
        </TabsContent>

        <TabsContent value="professionals" className="space-y-4">
          <ProfessionalsTab professionalPerformance={data.professionalPerformance} />
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <ReportExporter 
            data={data}
            reportType="advanced"
            period={`${dateRange?.from?.toISOString().split('T')[0]} - ${dateRange?.to?.toISOString().split('T')[0]}`}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
