
import React, { useState } from "react";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { DashboardInsights } from "@/components/dashboard/DashboardInsights";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { PopularServicesWidget } from "@/components/dashboard/PopularServicesWidget";
import { UpcomingAppointmentsWidget } from "@/components/dashboard/UpcomingAppointmentsWidget";
import { RetentionRateCard } from "@/components/dashboard/RetentionRateCard";
import { FinancialCharts } from "@/components/dashboard/FinancialCharts";
import { FilterPeriod } from "@/types/dashboard";
import { AppointmentCalendar } from "@/components/dashboard/Calendar";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import { useNeedsOnboarding } from "@/hooks/useNeedsOnboarding";
import { OnboardingBanner } from "@/components/dashboard/OnboardingBanner";
import { toast } from "sonner";
import { useTenant } from "@/contexts/TenantContext";

interface PopularService {
  id: string;
  name: string;
  count: number;
  percentage: number;
}

const Dashboard = () => {
  const [period, setPeriod] = useState<FilterPeriod>("month");
  const { stats, loading, error } = useDashboardData(period);
  const { needsOnboarding, onboardingViewed, markOnboardingAsViewed, refreshOnboardingStatus } = useNeedsOnboarding();
  const { businessId } = useTenant();

  const handleFilterChange = (newPeriod: FilterPeriod) => {
    setPeriod(newPeriod);
  };
  
  const handleDismissOnboarding = () => {
    markOnboardingAsViewed();
    toast.success("Status atualizado com sucesso!");
    refreshOnboardingStatus(true);
  };

  // Process popular services to add percentage
  const processPopularServices = (): PopularService[] => {
    if (!stats.popularServices || stats.popularServices.length === 0) {
      return [];
    }
    
    // Calculate total count
    const totalCount = stats.popularServices.reduce((sum, service) => sum + service.count, 0);
    
    // Add percentage to each service
    return stats.popularServices.map(service => ({
      ...service,
      percentage: Math.round((service.count / totalCount) * 100)
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />

      {/* Onboarding Banner */}
      {needsOnboarding && !onboardingViewed && (
        <OnboardingBanner onDismiss={handleDismissOnboarding} />
      )}

      {/* Dashboard Content */}
      <div className="flex-1 space-y-6 p-4 md:p-5 pb-8">
        {/* KPI Cards */}
        <KpiCards stats={stats} period={period} />

        {/* Dashboard Filters */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Dashboard
          </h2>
          <DashboardFilters period={period} onFilterChange={handleFilterChange} />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Financial Charts */}
            <FinancialCharts data={stats.revenueData} />

            {/* Calendar */}
            <AppointmentCalendar businessId={businessId} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Insights Card */}
            <DashboardInsights stats={stats} />

            {/* Performance Metrics */}
            <PerformanceMetrics stats={stats} />

            {/* Retention Rate */}
            <RetentionRateCard 
              retentionRate={stats.retentionRate}
              newClients={stats.newClientsCount}
              returningClients={stats.returningClientsCount}
            />
          </div>
        </div>

        {/* Additional Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Upcoming Appointments */}
          <UpcomingAppointmentsWidget appointments={stats.upcomingAppointments || []} />

          {/* Popular Services */}
          <PopularServicesWidget services={processPopularServices()} />
        </div>

        {/* Dashboard Footer */}
        <DashboardFooter />
      </div>
    </div>
  );
};

export default Dashboard;
