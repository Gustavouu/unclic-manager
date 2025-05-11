
import React, { useEffect } from "react";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardInsights } from "@/components/dashboard/DashboardInsights";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { OnboardingBanner } from "@/components/dashboard/OnboardingBanner";

const Dashboard = () => {
  useEffect(() => {
    document.title = "Dashboard | Unclic Manager";
  }, []);

  return (
    <div className="space-y-6">
      <OnboardingBanner />
      <DashboardHeader />
      <DashboardOverview />
      <DashboardInsights />
      <DashboardFooter />
    </div>
  );
};

export default Dashboard;
