
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import { useTenant } from "@/contexts/TenantContext";
import { useNeedsOnboarding } from "@/hooks/useNeedsOnboarding";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid";
import { PopularServicesWidget } from "@/components/dashboard/PopularServicesWidget";
import { UpcomingAppointmentsWidget } from "@/components/dashboard/UpcomingAppointmentsWidget";
import { FinancialCharts } from "@/components/dashboard/FinancialCharts";
import { DashboardInsights } from "@/components/dashboard/DashboardInsights";
import { FilterPeriod } from "@/types/dashboard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BusinessSetupAlert } from "@/components/dashboard/BusinessSetupAlert";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CalendarClock, DollarSign, Scissors } from "lucide-react";
import { formatCurrency } from "@/lib/format";

const Dashboard = () => {
  const [period, setPeriod] = useState<FilterPeriod>("month");
  const { stats, loading: statsLoading } = useDashboardData(period);
  const { businessNeedsSetup, loading: businessLoading } = useTenant();
  
  useEffect(() => {
    document.title = "Dashboard | Unclic Manager";
  }, []);

  const handlePeriodChange = (value: string) => {
    setPeriod(value as FilterPeriod);
  };

  // Componente do filtro de período para ser passado como actions para o PageHeader
  const PeriodFilter = (
    <div className="w-[180px]">
      <Select value={period} onValueChange={handlePeriodChange}>
        <SelectTrigger>
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Hoje</SelectItem>
          <SelectItem value="week">Esta Semana</SelectItem>
          <SelectItem value="month">Este Mês</SelectItem>
          <SelectItem value="quarter">Este Trimestre</SelectItem>
          <SelectItem value="year">Este Ano</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  // Use conditional rendering based on loading states and business setup
  if (businessLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  // Render business setup alert if needed
  if (businessNeedsSetup) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Painel de Controle"
          description="Bem-vindo ao seu dashboard. Configure seu negócio para começar."
        />
        <BusinessSetupAlert 
          message="Configure seu negócio para visualizar o painel de controle completo." 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Painel de Controle"
        description="Bem-vindo ao seu dashboard. Aqui você encontra os dados mais importantes do seu negócio."
        actions={PeriodFilter}
      />
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clientes Ativos</p>
                <p className="text-2xl font-bold mt-1">{stats.clientsCount || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Total de clientes</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-full">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Próximos Agendamentos</p>
                <p className="text-2xl font-bold mt-1">{stats.todayAppointments || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Agendamentos próximos</p>
              </div>
              <div className="p-2 bg-indigo-50 rounded-full">
                <CalendarClock className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(stats.monthlyRevenue || 0)}</p>
                <p className="text-xs text-muted-foreground mt-1">Este mês</p>
              </div>
              <div className="p-2 bg-green-50 rounded-full">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Serviços Realizados</p>
                <p className="text-2xl font-bold mt-1">{stats.monthlyServices || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Este mês</p>
              </div>
              <div className="p-2 bg-amber-50 rounded-full">
                <Scissors className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desempenho Financeiro Chart */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-1">Desempenho Financeiro</h3>
          <p className="text-sm text-muted-foreground mb-4">Receitas e despesas ao longo do período</p>
          
          <div className="flex justify-end mb-4">
            <div className="flex gap-4 text-sm">
              <button className="py-1 px-3 bg-gray-100 rounded-md font-medium">Barras</button>
              <button className="py-1 px-3 rounded-md font-medium text-muted-foreground">Linha</button>
            </div>
          </div>
          
          <div className="h-64">
            <FinancialCharts data={stats.revenueData || []} />
          </div>
        </CardContent>
      </Card>

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Dashboard</h3>
              <DashboardInsights stats={stats} />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Insights</h3>
              <div className="space-y-4">
                <div className="flex gap-3 items-start pb-3 border-b">
                  <div className="p-2 rounded-full bg-amber-50 text-amber-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12l7-7 7 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Receita abaixo da média</p>
                    <p className="text-sm text-muted-foreground">A receita está 10% abaixo da média dos últimos 3 meses</p>
                  </div>
                </div>
                
                <div className="flex gap-3 items-start pb-3 border-b">
                  <div className="p-2 rounded-full bg-indigo-50 text-indigo-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="7" />
                      <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Serviço destaque</p>
                    <p className="text-sm text-muted-foreground">Monitore quais serviços estão com maior procura</p>
                  </div>
                </div>
                
                <div className="flex gap-3 items-start">
                  <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Base de clientes estável</p>
                    <p className="text-sm text-muted-foreground">Considere estratégias para atrair novos clientes</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
