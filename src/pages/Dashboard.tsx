
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
  const { currentBusiness } = useTenant();
  const { needsOnboarding } = useNeedsOnboarding();
  
  useEffect(() => {
    document.title = "Dashboard | Unclic Manager";
    
    // Only show the toast notification once when the component mounts
    if (currentBusiness?.status === "pendente") {
      toast.info("Seu negócio está com status pendente. Clique em 'Corrigir status' para resolver.", {
        duration: 8000,
        id: "business-status-pendente", // Using ID prevents duplicate toasts
        onDismiss: () => {
          // Store in localStorage that the user has seen this notification
          localStorage.setItem("status-notification-shown", "true");
        }
      });
    }
    
    // No intervals or periodic refreshes here - removed to prevent reloading loops
  }, [currentBusiness?.status]);

  return (
    <div className="space-y-6">
      {needsOnboarding && <OnboardingBanner />}
      <DashboardHeader />
      <DashboardOverview />
      <DashboardInsights stats={stats} />
      <DashboardFooter />
      
      {/* StatusFixButton will only show if business status is pendente */}
    </div>
  );
};

export default Dashboard;
