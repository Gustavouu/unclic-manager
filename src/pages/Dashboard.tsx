
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { NextAppointments } from "@/components/dashboard/NextAppointments";
import { FinancialCharts } from "@/components/dashboard/FinancialCharts";
import { PopularServicesWidget } from "@/components/dashboard/PopularServicesWidget";
import { DashboardInsights } from "@/components/dashboard/DashboardInsights";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { FilterPeriod } from "@/types/dashboard";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("geral");
  const [currentPeriod, setCurrentPeriod] = useState<FilterPeriod>("month");
  
  const { stats, loading, error, refreshData } = useDashboardData(currentPeriod);
  
  const handleExportCSV = () => {
    toast.info("Exportando dados em CSV...");
    // Lógica para exportar em CSV seria implementada aqui
    setTimeout(() => toast.success("Dados exportados com sucesso!"), 1500);
  };
  
  const handleExportPDF = () => {
    toast.info("Exportando dados em PDF...");
    // Lógica para exportar em PDF seria implementada aqui
    setTimeout(() => toast.success("Dados exportados com sucesso!"), 1500);
  };
  
  const handlePeriodChange = (period: FilterPeriod) => {
    setCurrentPeriod(period);
  };
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Erro ao carregar dados</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refreshData}>Tentar novamente</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Cabeçalho e Filtros */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <DashboardHeader />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <DashboardFilters 
            currentPeriod={currentPeriod} 
            onPeriodChange={handlePeriodChange} 
          />
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleExportCSV}
            >
              <FileText size={16} />
              <span className="hidden sm:inline">Exportar CSV</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleExportPDF}
            >
              <Download size={16} />
              <span className="hidden sm:inline">Exportar PDF</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* KPIs */}
      <KpiCards stats={stats} period={currentPeriod} />
      
      {/* Tabs de Conteúdo */}
      <Tabs defaultValue="geral" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="servicos">Serviços</TabsTrigger>
        </TabsList>
        
        <TabsContent value="geral" className="space-y-6">
          {/* Gráfico financeiro principal */}
          <FinancialCharts data={stats.revenueData} />
          
          {/* Grid de widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Próximos agendamentos */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border shadow p-4">
                <h2 className="text-lg font-display font-bold mb-4">Próximos Agendamentos</h2>
                <NextAppointments 
                  appointments={stats.nextAppointments || []} 
                  isLoading={loading} 
                />
              </div>
            </div>
            
            {/* Coluna de insights e métricas */}
            <div className="space-y-6">
              <DashboardInsights stats={stats} />
              <PopularServicesWidget services={stats.popularServices || []} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="financeiro" className="space-y-6">
          <FinancialCharts data={stats.revenueData} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg border shadow p-4">
              <h2 className="text-lg font-display font-bold mb-4">Indicadores Financeiros</h2>
              <PerformanceMetrics stats={stats} />
            </div>
            <div className="bg-card rounded-lg border shadow p-4">
              <h2 className="text-lg font-display font-bold mb-4">Serviços por Receita</h2>
              <PopularServicesWidget services={stats.popularServices || []} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="clientes">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg border shadow p-4">
                <h2 className="text-lg font-display font-bold mb-4">Novos Clientes vs Recorrentes</h2>
                <div className="p-4 text-center">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Novos</p>
                      <p className="text-3xl font-bold text-green-600">{stats.newClientsCount || 0}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Recorrentes</p>
                      <p className="text-3xl font-bold text-blue-600">{stats.returningClientsCount || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg border shadow p-4">
                <h2 className="text-lg font-display font-bold mb-4">Taxa de Retenção</h2>
                <div className="flex flex-col items-center justify-center h-40">
                  <p className="text-6xl font-bold text-indigo-600">{stats.retentionRate || 0}%</p>
                  <p className="text-sm text-muted-foreground mt-2">Taxa de retenção de clientes</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="servicos">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg border shadow p-4">
                <h2 className="text-lg font-display font-bold mb-4">Serviços Populares</h2>
                <PopularServicesWidget services={stats.popularServices || []} />
              </div>
              <div className="bg-card rounded-lg border shadow p-4">
                <h2 className="text-lg font-display font-bold mb-4">Métricas de Desempenho</h2>
                <PerformanceMetrics stats={stats} />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Rodapé do Dashboard */}
      <DashboardFooter />
    </div>
  );
};

export default Dashboard;
