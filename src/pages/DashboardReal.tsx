
import React, { Suspense } from 'react';
import { OnboardingRedirect } from '@/components/auth/OnboardingRedirect';
import { PageHeader, PageContainer } from '@/components/ui/page-header';
import { MetricCard, MetricGrid } from '@/components/ui/metric-card';
import { Loading } from '@/components/ui/loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NextAppointments } from '@/components/dashboard/NextAppointments';
import { BirthdayClients } from '@/components/dashboard/BirthdayClients';
import { OnboardingBannerFixed } from '@/components/dashboard/OnboardingBannerFixed';
import { PopularServicesReal } from '@/components/dashboard/PopularServicesReal';
import { RevenueChartReal } from '@/components/dashboard/RevenueChartReal';
import { useDashboardMetricsReal } from '@/hooks/dashboard/useDashboardMetricsReal';
import { 
  DollarSign, 
  Calendar, 
  Users, 
  TrendingUp,
  Clock,
  AlertTriangle
} from 'lucide-react';

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <MetricGrid>
      {[...Array(4)].map((_, i) => (
        <MetricCard 
          key={i}
          title=""
          value=""
          loading={true}
        />
      ))}
    </MetricGrid>
    <div className="grid gap-6 md:grid-cols-2">
      <Loading size="lg" className="h-80" />
      <Loading size="lg" className="h-80" />
    </div>
  </div>
);

export default function DashboardReal() {
  const { metrics, revenueData, popularServices, isLoading, error, formatCurrency } = useDashboardMetricsReal();

  if (error) {
    return (
      <OnboardingRedirect>
        <PageContainer>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar dados</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </PageContainer>
      </OnboardingRedirect>
    );
  }

  return (
    <OnboardingRedirect>
      <PageContainer>
        <div className="space-y-6">
          <OnboardingBannerFixed />
          
          <PageHeader
            title="Dashboard Real"
            description="Dados reais em tempo real do seu negócio"
          />

          <Suspense fallback={<DashboardSkeleton />}>
            {/* Métricas principais com dados reais */}
            <MetricGrid>
              <MetricCard
                title="Receita do Mês"
                value={metrics.monthlyRevenue}
                change={{ 
                  value: metrics.growthRate, 
                  type: metrics.growthRate > 0 ? 'increase' : metrics.growthRate < 0 ? 'decrease' : 'neutral'
                }}
                icon={DollarSign}
                format="currency"
                loading={isLoading}
              />
              
              <MetricCard
                title="Agendamentos do Mês"
                value={metrics.totalAppointments}
                change={{ 
                  value: metrics.completedAppointments, 
                  type: 'neutral', 
                  label: 'concluídos' 
                }}
                icon={Calendar}
                loading={isLoading}
              />
              
              <MetricCard
                title="Clientes Ativos"
                value={metrics.activeClients}
                change={{ 
                  value: metrics.newClientsThisMonth, 
                  type: 'increase', 
                  label: 'novos' 
                }}
                icon={Users}
                loading={isLoading}
              />
              
              <MetricCard
                title="Agendamentos Hoje"
                value={metrics.todayAppointments}
                change={{ 
                  value: metrics.pendingAppointments, 
                  type: 'neutral', 
                  label: 'pendentes' 
                }}
                icon={Clock}
                loading={isLoading}
              />
            </MetricGrid>

            {/* Gráficos e análises */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <RevenueChartReal 
                  data={revenueData}
                  isLoading={isLoading}
                  showTarget={true}
                  height={350}
                />
              </div>
              
              <div>
                <PopularServicesReal 
                  services={popularServices}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Cards de métricas adicionais */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(metrics.averageTicket)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Por agendamento concluído
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Retenção</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {metrics.retentionRate.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Clientes ativos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Cancelamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${
                    metrics.cancellationRate > 15 ? 'text-red-600' : 
                    metrics.cancellationRate > 10 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {metrics.cancellationRate.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Do total de agendamentos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${
                    metrics.growthRate > 0 ? 'text-green-600' : 
                    metrics.growthRate < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metrics.growthRate > 0 ? '+' : ''}{metrics.growthRate.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Seção inferior */}
            <div className="grid gap-6 md:grid-cols-2">
              <NextAppointments appointments={[]} />
              <BirthdayClients />
            </div>
          </Suspense>
        </div>
      </PageContainer>
    </OnboardingRedirect>
  );
}
