
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ClientDashboardWidget } from '@/components/clients/ClientDashboardWidget';
import { useDashboardData, FilterPeriod } from '@/hooks/useDashboardData';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { OnboardingRedirect } from '@/components/auth/OnboardingRedirect';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [period, setPeriod] = useState<FilterPeriod>('month');
  const { metrics, isLoading, error } = useDashboardData(period);
  const navigate = useNavigate();

  if (error) {
    return (
      <OnboardingRedirect>
        <div className="text-center py-12">
          <p className="text-red-600">Erro ao carregar dados do dashboard: {error}</p>
        </div>
      </OnboardingRedirect>
    );
  }

  // Transform metrics to chart data format
  const chartData = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    value: Math.floor(Math.random() * 1000) + 500
  }));

  const handleViewAllClients = () => {
    navigate('/clients');
  };

  const handleViewClient = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  const handleNewClient = () => {
    navigate('/clients?action=new');
  };

  return (
    <OnboardingRedirect>
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

        {/* Main Stats */}
        <DashboardStats 
          stats={{
            totalClients: metrics.totalClients,
            totalServices: metrics.totalServices || 0,
            totalAppointments: metrics.totalAppointments,
            totalRevenue: metrics.totalRevenue,
            newClients: metrics.newClients || 0,
            completionRate: metrics.completionRate || 0,
          }} 
          loading={isLoading} 
        />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Revenue Chart */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Receita do Período</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <RevenueChart data={chartData} />
            </CardContent>
          </Card>
          
          {/* Quick Actions */}
          <QuickActions />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Client Dashboard Widget */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <ClientDashboardWidget
                  onViewAllClients={handleViewAllClients}
                  onViewClient={handleViewClient}
                  onNewClient={handleNewClient}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Activity */}
          <RecentActivity />
        </div>

        {/* Popular Services */}
        <Card>
          <CardHeader>
            <CardTitle>Serviços Populares</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.popularServices && metrics.popularServices.length > 0 ? (
              <div className="space-y-3">
                {metrics.popularServices.map((service, index) => (
                  <div key={service.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">{service.name}</span>
                    <span className="text-sm text-gray-600">{service.count} agendamentos</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum dado de serviços disponível</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </OnboardingRedirect>
  );
}
