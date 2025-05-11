
import React, { useEffect } from "react";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardInsights } from "@/components/dashboard/DashboardInsights";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { OnboardingBanner } from "@/components/dashboard/OnboardingBanner";
import { useDashboardData } from "@/hooks/dashboard/useDashboardData";

const Dashboard = () => {
  const { stats, loading } = useDashboardData();
  
  useEffect(() => {
    document.title = "Dashboard | Unclic Manager";
  }, []);

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
