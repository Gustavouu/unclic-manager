
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { DashboardInsights } from '@/components/dashboard/DashboardInsights';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { useDashboardData } from '@/hooks/useDashboardData';
import { FilterPeriod, ChartData } from '@/types/dashboard';

export default function Dashboard() {
  const [period, setPeriod] = useState<FilterPeriod>('month');
  const { stats, loading, error } = useDashboardData(period);

  if (loading) {
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

  // Transform revenue data to chart data format
  const chartData: ChartData[] = stats.revenueData?.map(item => ({
    date: item.date,
    value: item.revenue || 0
  })) || [];

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
