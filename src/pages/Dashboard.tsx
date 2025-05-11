
import React, { useEffect } from "react";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardInsights } from "@/components/dashboard/DashboardInsights";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { OnboardingBanner } from "@/components/dashboard/OnboardingBanner";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import { useTenant } from "@/contexts/TenantContext";
import { useNeedsOnboarding } from "@/hooks/useNeedsOnboarding";

const Dashboard = () => {
  const { stats, loading } = useDashboardData();
  const { currentBusiness, refreshBusinessData } = useTenant();
  const { refreshOnboardingStatus } = useNeedsOnboarding();
  
  useEffect(() => {
    document.title = "Dashboard | Unclic Manager";
    
    // Refresh business status when dashboard loads
    const refreshData = async () => {
      try {
        await Promise.all([
          refreshBusinessData(),
          refreshOnboardingStatus()
        ]);
      } catch (error) {
        console.error("Erro ao atualizar dados:", error);
      }
    };
    
    refreshData();
  }, [refreshBusinessData, refreshOnboardingStatus]);

  return (
    <div className="space-y-6">
      <OnboardingBanner />
      <DashboardHeader />
      <DashboardOverview />
      <DashboardInsights stats={stats} />
      <DashboardFooter />
    </div>
  );
};

export default Dashboard;
