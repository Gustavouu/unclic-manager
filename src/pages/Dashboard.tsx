
import React, { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { FinancialCharts } from '@/components/dashboard/FinancialCharts';
import { PopularServices } from '@/components/dashboard/PopularServices';
import { NextAppointments } from '@/components/dashboard/NextAppointments';
import { ClientsComparisonChart } from '@/components/dashboard/ClientsComparisonChart';
import { RetentionRateCard } from '@/components/common/RetentionRateCard';
import { PerformanceMetrics } from '@/components/dashboard/PerformanceMetrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilterPeriod, useDashboardData } from '@/hooks/useDashboardData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [period, setPeriod] = useState<FilterPeriod>('month');
  const { stats, isLoading, error } = useDashboardData(period);

  const handleRefresh = () => {
    window.location.reload();
  };

  // Create default stats if not available
  const defaultStats = {
    totalAppointments: 0,
    completedAppointments: 0,
    totalRevenue: 0,
    newClients: 0,
    clientsCount: 0,
    averageTicket: 0,
    retentionRate: 0,
    popularServices: [],
    revenueData: [],
    appointmentsToday: 0,
    pendingAppointments: 0,
    cancellationRate: 0,
    ...stats
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Painel de Controle</h1>
          <p className="text-gray-600 mt-1">Bem-vindo ao seu dashboard. Aqui você encontra os dados mais importantes do seu negócio.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={(value) => setPeriod(value as FilterPeriod)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Último mês</SelectItem>
              <SelectItem value="quarter">Último trimestre</SelectItem>
              <SelectItem value="year">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiCards stats={defaultStats} period={period} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Desempenho Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <FinancialCharts revenueData={defaultStats?.revenueData || []} loading={isLoading} />
          </CardContent>
        </Card>

        {/* Popular Services */}
        <Card>
          <CardHeader>
            <CardTitle>Serviços Populares</CardTitle>
          </CardHeader>
          <CardContent>
            {defaultStats?.popularServices && (
              <div className="space-y-4">
                {defaultStats.popularServices.map((service: any) => (
                  <div key={service.id} className="flex items-center justify-between">
                    <span>{service.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">{service.count} agendamentos</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${service.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Retention Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Retenção</CardTitle>
          </CardHeader>
          <CardContent>
            <RetentionRateCard 
              retentionRate={defaultStats?.retentionRate || 0}
              suggestions={[
                "Envie mensagens pós-atendimento",
                "Crie um programa de fidelidade",
                "Ofereça descontos para clientes recorrentes"
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
