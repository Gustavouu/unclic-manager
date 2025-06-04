
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { DashboardStats } from './DashboardStats';
import { RecentAppointments } from './RecentAppointments';
import { PopularServicesWidget } from './PopularServicesWidget';
import { DashboardMetricsUnified } from './DashboardMetricsUnified';
import { RevenueChart } from './RevenueChart';
import { useDashboardMetrics } from '@/hooks/dashboard/useDashboardMetrics';
import { usePermissions } from '@/hooks/security/usePermissions';
import { useOptimizedTenant } from '@/contexts/OptimizedTenantContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp,
  Settings,
  Plus,
  RefreshCw,
  BarChart3,
  Clock,
  AlertTriangle
} from 'lucide-react';

export const EnhancedDashboard: React.FC = () => {
  const { currentBusiness, isLoading: tenantLoading } = useOptimizedTenant();
  const { permissions, isAdmin, loading: permissionsLoading } = usePermissions();
  const { metrics, revenueData, popularServices, isLoading: metricsLoading, lastUpdate, refreshData } = useDashboardMetrics();

  const isLoading = tenantLoading || permissionsLoading || metricsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Carregando..."
        />
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-32 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const hasBasicSetup = currentBusiness?.name && permissions.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageHeader
          title="Dashboard"
          description={`Bem-vindo ${isAdmin ? 'Administrador' : 'ao sistema'}! ${currentBusiness?.name ? `Gerenciando: ${currentBusiness.name}` : ''}`}
        />
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">
            {lastUpdate && (
              <>Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}</>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Alert for setup status */}
      {!hasBasicSetup && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex items-center space-x-3 p-4">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-orange-800">
                Configuração Incompleta
              </p>
              <p className="text-sm text-orange-700">
                Complete a configuração do seu negócio para aproveitar todas as funcionalidades.
              </p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Stats */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Appointments - Takes most space */}
        <div className="lg:col-span-8">
          <RecentAppointments />
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Adicionar Cliente
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Ver Relatórios
              </Button>
            </CardContent>
          </Card>

          {/* Popular Services */}
          <PopularServicesWidget services={popularServices.map(service => ({
            name: service.name,
            count: service.count,
            percentage: service.percentage
          }))} />

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo Rápido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Próximos agendamentos</span>
                <Badge variant="secondary">{metrics.pendingAppointments}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Clientes ativos</span>
                <Badge variant="secondary">{metrics.activeClients}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Taxa de ocupação</span>
                <Badge variant="secondary">85%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avaliação média</span>
                <Badge variant="secondary">4.8 ⭐</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolução da Receita
          </CardTitle>
          <CardDescription>
            Receita dos últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RevenueChart data={revenueData.map(item => ({
            date: item.date,
            value: item.value
          }))} />
        </CardContent>
      </Card>
    </div>
  );
};
