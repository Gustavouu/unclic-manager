
"use client";

import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { DashboardInsights } from "@/components/dashboard/DashboardInsights";
import { ClientsComparisonChart } from "@/components/dashboard/ClientsComparisonChart";
import { BirthdayClients } from "@/components/dashboard/BirthdayClients";
import { DataMigrationTool } from "@/components/admin/DataMigrationTool";
import { DashboardStats } from "@/types/dashboard";

export default function DashboardPage() {
  // Using static data for testing purposes
  const mockDashboardStats: DashboardStats = {
    totalAppointments: 150,
    completedAppointments: 120,
    totalRevenue: 8500,
    newClients: 12,
    clientsCount: 85,
    todayAppointments: 8,
    monthlyRevenue: 8500,
    monthlyServices: 150,
    occupancyRate: 75,
    popularServices: [
      { id: "1", name: "Corte de Cabelo", count: 78 },
      { id: "2", name: "Barba", count: 45 },
      { id: "3", name: "Combo", count: 35 },
    ],
    upcomingAppointments: [],
    nextAppointments: [],
    revenueData: [{date: "2023-01-01", value: 1000}],
    retentionRate: 80,
    newClientsCount: 12,
    returningClientsCount: 73,
    appointmentsCount: 150,
    averageRating: 4.8
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
