
import React, { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { OnboardingBanner } from "@/components/dashboard/OnboardingBanner";
import { StatusFixButton } from "@/components/dashboard/StatusFixButton";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import { useTenant } from "@/contexts/TenantContext";
import { useNeedsOnboarding } from "@/hooks/useNeedsOnboarding";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid";
import { PopularServicesWidget } from "@/components/dashboard/PopularServicesWidget";
import { UpcomingAppointmentsWidget } from "@/components/dashboard/UpcomingAppointmentsWidget";
import { FinancialCharts } from "@/components/dashboard/FinancialCharts";
import { DashboardInsights } from "@/components/dashboard/DashboardInsights";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { ClientsComparisonChart } from "@/components/dashboard/ClientsComparisonChart";
import { BirthdayClients } from "@/components/dashboard/BirthdayClients";
import { RetentionRateCard } from "@/components/dashboard/RetentionRateCard";
import { FilterPeriod } from "@/types/dashboard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Dashboard = () => {
  const [period, setPeriod] = useState<FilterPeriod>("month");
  const { stats, loading: statsLoading } = useDashboardData(period);
  const { currentBusiness } = useTenant();
  const { needsOnboarding, loading: onboardingLoading } = useNeedsOnboarding();
  
  useEffect(() => {
    document.title = "Dashboard | Unclic Manager";
  }, []);

  const handlePeriodChange = (value: string) => {
    setPeriod(value as FilterPeriod);
  };

  // Use conditional rendering based on loading states
  if (onboardingLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {needsOnboarding && <OnboardingBanner />}
      <DashboardHeader />
      
      {/* Period filter */}
      <div className="flex justify-end">
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
      </div>
      
      {/* KPI Cards - Mantendo no topo */}
      <KpiCards stats={stats} period={period} />

      {/* Financial Charts - Agora com largura total para destaque */}
      <FinancialCharts data={stats.revenueData || []} />
      
      {/* Próximos Agendamentos e Serviços Populares lado a lado */}
      <ResponsiveGrid 
        columns={{ default: 1, md: 2 }}
        gap="md"
        equalHeight={true}
      >
        <UpcomingAppointmentsWidget appointments={stats.nextAppointments || []} />
        <PopularServicesWidget services={stats.popularServices || []} />
      </ResponsiveGrid>

      {/* Novos Clientes vs Recorrentes e Taxa de Retenção lado a lado */}
      <ResponsiveGrid 
        columns={{ default: 1, md: 2 }}
        gap="md"
        equalHeight={true}
      >
        <ClientsComparisonChart stats={stats} />
        <RetentionRateCard stats={stats} />
      </ResponsiveGrid>

      {/* Aniversariantes do Mês e Métricas de Desempenho lado a lado */}
      <ResponsiveGrid 
        columns={{ default: 1, md: 2 }}
        gap="md"
        equalHeight={true}
      >
        <BirthdayClients />
        <PerformanceMetrics stats={stats} />
      </ResponsiveGrid>
      
      {/* Insights - Largura total no final */}
      <DashboardInsights stats={stats} />
      
      <DashboardFooter />
      <StatusFixButton />
    </div>
  );
};

export default Dashboard;
