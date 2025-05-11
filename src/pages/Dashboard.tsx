
import React, { useEffect } from "react";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardInsights } from "@/components/dashboard/DashboardInsights";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { OnboardingBanner } from "@/components/dashboard/OnboardingBanner";
import { StatusFixButton } from "@/components/dashboard/StatusFixButton";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import { useTenant } from "@/contexts/TenantContext";
import { useNeedsOnboarding } from "@/hooks/useNeedsOnboarding";

const Dashboard = () => {
  const { stats, loading: statsLoading } = useDashboardData();
  const { currentBusiness } = useTenant();
  const { needsOnboarding, loading: onboardingLoading } = useNeedsOnboarding();
  
  useEffect(() => {
    document.title = "Dashboard | Unclic Manager";
  }, []);

  // Use conditional rendering based on loading states
  if (onboardingLoading) {
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
      <DashboardOverview />
      <DashboardInsights stats={stats} />
      <DashboardFooter />
      <StatusFixButton />
    </div>
  );
};

export default Dashboard;
