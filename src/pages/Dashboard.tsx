
import React from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { DashboardInsights } from '@/components/dashboard/DashboardInsights';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { FinancialChart } from '@/components/dashboard/FinancialChart';
import { PopularServices } from '@/components/dashboard/PopularServices';
import { NextAppointments } from '@/components/dashboard/NextAppointments';
import { ClientsComparisonChart } from '@/components/dashboard/ClientsComparisonChart';
import { RetentionRateCard } from '@/components/dashboard/RetentionRateCard';
import { PerformanceMetrics } from '@/components/dashboard/PerformanceMetrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardData } from '@/hooks/dashboard/useDashboardData';
import { FilterPeriod } from '@/types/dashboard';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [period, setPeriod] = useState<FilterPeriod>('month');
  const { stats, loading, error } = useDashboardData(period);

  const handleRefresh = () => {
    window.location.reload();
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
      <KpiCards stats={stats} period={period} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Desempenho Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <FinancialChart data={stats?.revenueData} />
          </CardContent>
        </Card>

        {/* Popular Services */}
        <Card>
          <CardHeader>
            <CardTitle>Serviços Populares</CardTitle>
          </CardHeader>
          <PopularServices 
            services={stats?.popularServices?.map((service, index) => ({
              id: service.id,
              name: service.name,
              count: service.count,
              percentage: stats.totalAppointments > 0 ? (service.count / stats.totalAppointments) * 100 : 0
            })) || []} 
            loading={loading} 
          />
        </Card>

        {/* Next Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <NextAppointments appointments={stats?.nextAppointments || []} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business Insights */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Insights do Negócio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Receita abaixo da média</h4>
                  <p className="text-sm text-gray-600">A receita está 10% abaixo da média dos últimos 3 meses</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Serviço destaque</h4>
                  <p className="text-sm text-gray-600">Monitore quais serviços estão com maior procura</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Base de clientes estável</h4>
                  <p className="text-sm text-gray-600">Considere estratégias para atrair novos clientes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Retention Rate */}
        <div className="space-y-6">
          <RetentionRateCard 
            retentionRate={stats?.retentionRate || 70}
            monthlyGoal={90}
            suggestions={[
              "Enviar follow-ups após atendimentos",
              "Oferecer descontos para clientes recorrentes", 
              "Criar programa de fidelidade"
            ]}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Comparação de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <ClientsComparisonChart 
                newClients={stats?.newClientsCount || 0}
                returningClients={stats?.returningClientsCount || 0}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Metrics */}
      <PerformanceMetrics stats={stats} />
    </div>
  );
}
