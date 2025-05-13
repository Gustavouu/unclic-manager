
import { Metadata } from "next";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { DashboardInsights } from "@/components/dashboard/DashboardInsights";
import { ClientsComparisonChart } from "@/components/dashboard/ClientsComparisonChart";
import { BirthdayClients } from "@/components/dashboard/BirthdayClients";
import { DataMigrationTool } from "@/components/admin/DataMigrationTool";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Visão geral do seu negócio",
};

export default function DashboardPage() {
  // Using static data for testing purposes
  const mockDashboardStats = {
    monthlyRevenue: 8500,
    appointmentsCount: 150,
    clientsCount: 85,
    newClientsCount: 12,
    returningClientsCount: 73,
    popularServices: [
      { name: "Corte de Cabelo", count: 78 },
      { name: "Barba", count: 45 },
      { name: "Combo", count: 35 },
    ],
    averageRating: 4.8,
  };

  return (
    <div className="container px-0 md:px-6 mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do seu negócio e desempenho recente
        </p>
      </div>

      {/* Data Migration Tool */}
      <div className="mb-8">
        <DataMigrationTool />
      </div>

      {/* Dashboard Metrics Overview */}
      <div className="mb-8">
        <DashboardOverview />
      </div>

      {/* Charts and Insights */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="md:col-span-2">
          <ClientsComparisonChart stats={mockDashboardStats} />
        </div>
        <div className="md:col-span-1">
          <DashboardInsights stats={mockDashboardStats} />
        </div>
      </div>

      {/* Birthday Clients */}
      <div className="mb-8">
        <BirthdayClients />
      </div>
    </div>
  );
}
