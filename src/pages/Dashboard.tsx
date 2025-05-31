
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { DashboardInsights } from '@/components/dashboard/DashboardInsights';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { useDashboardData } from '@/hooks/dashboard/useDashboardData';
import { FilterPeriod, ChartData, DashboardStats } from '@/types/dashboard';

export default function Dashboard() {
  const [period, setPeriod] = useState<FilterPeriod>('month');
  const { metrics, isLoading, error } = useDashboardData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-16 bg-gray-200" />
              <CardContent className="h-20 bg-gray-100" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erro ao carregar dados do dashboard: {error}</p>
      </div>
    );
  }

  // Transform metrics to chart data format (simple mock data for now)
  const chartData: ChartData[] = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    value: Math.floor(Math.random() * 1000) + 500
  }));

  // Map metrics to DashboardStats format
  const stats: DashboardStats = {
    totalAppointments: metrics.totalAppointments,
    completedAppointments: Math.floor(metrics.totalAppointments * (metrics.completionRate / 100)),
    totalRevenue: metrics.totalRevenue,
    newClients: metrics.newClients,
    clientsCount: metrics.newClients * 5, // Mock estimate
    averageTicket: metrics.totalRevenue / Math.max(metrics.totalAppointments, 1),
    retentionRate: 85, // Mock value
    popularServices: metrics.popularServices.map(service => ({
      id: service.name,
      name: service.name,
      count: service.count,
      percentage: (service.count / metrics.totalAppointments) * 100
    })),
    revenueData: chartData.map(item => ({
      date: item.date,
      revenue: item.value,
      appointments: Math.floor(Math.random() * 10) + 5
    })),
    appointmentsToday: Math.floor(metrics.totalAppointments / 30),
    pendingAppointments: Math.floor(metrics.totalAppointments * 0.1),
    cancellationRate: 5, // Mock value
    cancelledAppointments: Math.floor(metrics.totalAppointments * 0.05),
    growthRate: 15, // Mock value
    occupancyRate: metrics.completionRate,
    todayAppointments: Math.floor(metrics.totalAppointments / 30),
    monthlyRevenue: metrics.totalRevenue,
    averageRating: 4.5, // Mock value
    totalClients: metrics.newClients * 5, // Mock estimate
    monthlyServices: metrics.totalAppointments,
    newClientsCount: metrics.newClients
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as FilterPeriod)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="today">Hoje</option>
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
            <option value="quarter">Este Trimestre</option>
            <option value="year">Este Ano</option>
          </select>
        </div>
      </div>

      <KpiCards stats={stats} period={period} />
      
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Receita do Período</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <RevenueChart data={chartData} />
          </CardContent>
        </Card>
        
        <div className="md:col-span-3">
          <DashboardInsights stats={stats} />
        </div>
      </div>
    </div>
  );
}
