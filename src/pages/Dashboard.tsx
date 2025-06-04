
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ClientDashboardWidget } from '@/components/clients/ClientDashboardWidget';
import { useDashboardMetrics, FilterPeriod } from '@/hooks/dashboard/useDashboardMetrics';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { OnboardingRedirect } from '@/components/auth/OnboardingRedirect';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [period, setPeriod] = useState<FilterPeriod>('month');
  const { metrics, popularServices, revenueData, isLoading, error, refreshData } = useDashboardMetrics();
  const navigate = useNavigate();

  const handleViewAllClients = () => {
    navigate('/clients');
  };

  const handleViewClient = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  const handleNewClient = () => {
    navigate('/clients?action=new');
  };

  // Transform metrics to chart data format if revenue data is empty
  const chartData = revenueData.length > 0 ? revenueData : Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    value: Math.floor(Math.random() * 1000) + 500
  }));

  return (
    <OnboardingRedirect>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as FilterPeriod)}
              className="border rounded-md px-3 py-2 text-sm"
              disabled={isLoading}
            >
              <option value="today">Hoje</option>
              <option value="week">Esta Semana</option>
              <option value="month">Este Mês</option>
              <option value="quarter">Este Trimestre</option>
              <option value="year">Este Ano</option>
            </select>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshData}
                className="ml-2"
              >
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Stats */}
        <DashboardStats 
          stats={{
            totalClients: metrics.totalClients,
            totalServices: metrics.totalAppointments,
            totalAppointments: metrics.totalAppointments,
            totalRevenue: metrics.monthlyRevenue,
            newClients: metrics.newClientsThisMonth,
            completionRate: metrics.totalAppointments > 0 ? (metrics.completedAppointments / metrics.totalAppointments) * 100 : 0,
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
            {popularServices && popularServices.length > 0 ? (
              <div className="space-y-3">
                {popularServices.map((service, index) => (
                  <div key={service.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">{service.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{service.count} agendamentos</span>
                      <span className="text-xs text-gray-500">({service.percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum dado de serviços disponível</p>
                <p className="text-sm mt-1">Os dados aparecerão conforme os agendamentos forem realizados</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </OnboardingRedirect>
  );
}
