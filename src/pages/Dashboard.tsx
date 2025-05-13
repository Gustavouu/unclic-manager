
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import { useTenant } from "@/contexts/TenantContext";
import { KPICard } from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterPeriod } from "@/types/dashboard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BusinessSetupAlert } from "@/components/dashboard/BusinessSetupAlert";
import { formatCurrency } from "@/lib/format";
import { Users, CalendarClock, DollarSign, Scissors, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  // Componente do filtro de período para o final da página
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
      />
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Clientes Ativos"
          value={stats.clientsCount || 0}
          description="Total de clientes"
          icon={<Users className="text-blue-600" />}
          accentColor="border-l-4 border-l-blue-500"
        />
        
        <KPICard
          title="Próximos Agendamentos"
          value={stats.todayAppointments || 0}
          description="Agendamentos próximos"
          icon={<CalendarClock className="text-indigo-600" />}
          accentColor="border-l-4 border-l-indigo-500"
        />
        
        <KPICard
          title="Receita"
          value={formatCurrency(stats.monthlyRevenue || 0)}
          description="Este mês"
          icon={<DollarSign className="text-green-600" />}
          accentColor="border-l-4 border-l-green-500"
        />
        
        <KPICard
          title="Serviços Realizados"
          value={stats.monthlyServices || 0}
          description="Este mês"
          icon={<Scissors className="text-amber-600" />}
          accentColor="border-l-4 border-l-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Desempenho Financeiro</CardTitle>
                <p className="text-sm text-muted-foreground">Receitas e despesas ao longo do período</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="active">Barras</Button>
                <Button variant="ghost" size="sm">Linha</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-md">
              <p className="text-muted-foreground">Gráfico de desempenho financeiro</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Insights Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Insights</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              <div className="flex gap-3 items-start p-4">
                <div className="p-2 rounded-full bg-amber-50 text-amber-600">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <p className="font-medium">Receita abaixo da média</p>
                  <p className="text-sm text-muted-foreground">
                    A receita está 10% abaixo da média dos últimos 3 meses
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 items-start p-4">
                <div className="p-2 rounded-full bg-indigo-50 text-indigo-600">
                  <Scissors size={18} />
                </div>
                <div>
                  <p className="font-medium">Serviço destaque</p>
                  <p className="text-sm text-muted-foreground">
                    Monitore quais serviços estão com maior procura
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 items-start p-4">
                <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                  <Users size={18} />
                </div>
                <div>
                  <p className="font-medium">Base de clientes estável</p>
                  <p className="text-sm text-muted-foreground">
                    Considere estratégias para atrair novos clientes
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
