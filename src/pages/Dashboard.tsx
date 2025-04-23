
import React, { useState, useEffect } from "react";
import { Download, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import { toast } from "sonner";

// Componentes do Dashboard
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { FinancialCharts } from "@/components/dashboard/FinancialCharts";
import { PopularServicesWidget } from "@/components/dashboard/PopularServicesWidget";
import { UpcomingAppointmentsWidget } from "@/components/dashboard/UpcomingAppointmentsWidget";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { DashboardInsights } from "@/components/dashboard/DashboardInsights";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";

// Tipos de filtro para o dashboard
export type FilterPeriod = "today" | "week" | "month" | "quarter" | "year";

const Dashboard = () => {
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("month");
  const { stats, loading, error, refreshData } = useDashboardData(filterPeriod);
  const { businessId, loading: businessLoading, error: businessError } = useCurrentBusiness();
  
  const handleExportData = (format: "csv" | "pdf") => {
    toast.success(`Exportando dados em formato ${format.toUpperCase()}...`);
    // Implementação da exportação seria adicionada aqui
  };
  
  if (businessLoading || loading) {
    return <DashboardSkeleton />;
  }
  
  if (businessError || error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <div className="text-xl font-semibold text-red-500">Erro ao carregar dados</div>
        <p className="text-muted-foreground text-center max-w-md">
          Não foi possível carregar os dados do seu negócio. Tente novamente mais tarde.
        </p>
        <Button 
          onClick={() => refreshData()}
          variant="outline"
        >
          Tentar novamente
        </Button>
      </div>
    );
  }
  
  if (!businessId) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <div className="text-xl font-semibold">Bem-vindo ao Sistema</div>
        <p className="text-muted-foreground text-center max-w-md">
          Para começar, você precisa configurar seu negócio. Acesse as configurações ou complete o processo de onboarding.
        </p>
        <div className="flex gap-2">
          <Button onClick={() => window.location.href = "/onboarding"}>
            Iniciar configuração
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.href = "/settings"}
          >
            Ir para configurações
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Cabeçalho do Dashboard com título e boas-vindas */}
      <DashboardHeader />
      
      {/* Filtros e Ações */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <DashboardFilters 
          currentPeriod={filterPeriod} 
          onPeriodChange={setFilterPeriod} 
        />
        
        <div className="flex gap-2 self-end">
          <Button variant="outline" size="sm" onClick={() => handleExportData("csv")}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExportData("pdf")}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>
      
      {/* Cards de KPIs principais */}
      <KpiCards stats={stats} period={filterPeriod} />
      
      {/* Conteúdo principal - dividido em abas por categoria */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Grade de conteúdo principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Área de gráficos financeiros - 2/3 da largura */}
            <div className="lg:col-span-2 space-y-5">
              <FinancialCharts data={stats.revenueData} />
              <PerformanceMetrics stats={stats} />
            </div>
            
            {/* Widgets laterais - 1/3 da largura */}
            <div className="space-y-5">
              <UpcomingAppointmentsWidget appointments={stats.nextAppointments} />
              <PopularServicesWidget services={stats.popularServices} />
              <DashboardInsights stats={stats} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="financial">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Detalhes Financeiros</h3>
            <p className="text-muted-foreground">
              Informações detalhadas sobre o desempenho financeiro estarão disponíveis nesta seção.
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Análise de Clientes</h3>
            <p className="text-muted-foreground">
              Estatísticas e insights sobre sua base de clientes serão exibidos aqui.
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="services">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Desempenho de Serviços</h3>
            <p className="text-muted-foreground">
              Análises detalhadas de seus serviços e produtos estarão disponíveis nesta seção.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Rodapé com informações sobre última atualização */}
      <DashboardFooter />
    </div>
  );
};

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-10 w-[180px]" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
      
      <Skeleton className="h-10 w-[300px]" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Skeleton className="h-[350px] w-full lg:col-span-2" />
        <Skeleton className="h-[350px] w-full" />
      </div>
    </div>
  );
};

export default Dashboard;
