
import React, { useEffect } from "react";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardInsights } from "@/components/dashboard/DashboardInsights";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { OnboardingBanner } from "@/components/dashboard/OnboardingBanner";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";
import { useTenant } from "@/contexts/TenantContext";
import { useNeedsOnboarding } from "@/hooks/useNeedsOnboarding";
import { toast } from "sonner";

const Dashboard = () => {
  const { stats, loading } = useDashboardData();
  const { currentBusiness, refreshBusinessData } = useTenant();
  const { refreshOnboardingStatus } = useNeedsOnboarding();
  
  useEffect(() => {
    document.title = "Dashboard | Unclic Manager";
    
    // Refresh business status when dashboard loads
    const refreshData = async () => {
      try {
        const results = await Promise.all([
          refreshBusinessData(),
          refreshOnboardingStatus()
        ]);
        
        // Check if business status is pendente and show a toast notification
        if (currentBusiness?.status === "pendente") {
          toast.info("Seu negócio está com status pendente. Clique em 'Corrigir status' para resolver.", {
            duration: 8000,
            id: "business-status-pendente"
          });
        }
      } catch (error) {
        console.error("Erro ao atualizar dados:", error);
      }
    };
    
    refreshData();
    
    // Set up a periodic refresh to check status updates
    const intervalId = setInterval(() => {
      refreshData();
    }, 60000); // Check every minute
    
    return () => {
      clearInterval(intervalId);
    };
  }, [refreshBusinessData, refreshOnboardingStatus, currentBusiness?.status]);

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
