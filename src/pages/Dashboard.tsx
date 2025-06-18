
import React, { Suspense } from 'react';
import { OnboardingRedirect } from '@/components/auth/OnboardingRedirect';
import { PageHeader, PageContainer } from '@/components/ui/page-header';
import { MetricCard, MetricGrid } from '@/components/ui/metric-card';
import { Loading } from '@/components/ui/loading';
import { DashboardChartsUnified } from '@/components/dashboard/DashboardChartsUnified';
import { NextAppointments } from '@/components/dashboard/NextAppointments';
import { PopularServices } from '@/components/dashboard/PopularServices';
import { BirthdayClients } from '@/components/dashboard/BirthdayClients';
import { OnboardingBannerFixed } from '@/components/dashboard/OnboardingBannerFixed';
import { useDashboardMetricsOptimized } from '@/hooks/dashboard/useDashboardMetricsOptimized';
import { 
  DollarSign, 
  Calendar, 
  Users, 
  TrendingUp,
  Scissors,
  Clock
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

export default function Dashboard() {
  const { popularServices, isLoading } = useDashboardMetricsOptimized();

  // Mock data para demonstração
  const mockMetrics = {
    revenue: 15750,
    previousRevenue: 14200,
    appointments: 185,
    previousAppointments: 168,
    clients: 245,
    newClients: 23,
    services: 12,
    completionRate: 92.4
  };

  const mockAppointments = [
    { 
      id: '1', 
      clientName: 'João Silva', 
      serviceName: 'Corte de Cabelo', 
      time: '14:00', 
      status: 'confirmed' as const 
    },
    { 
      id: '2', 
      clientName: 'Maria Santos', 
      serviceName: 'Manicure', 
      time: '15:30', 
      status: 'scheduled' as const 
    },
    { 
      id: '3', 
      clientName: 'Pedro Costa', 
      serviceName: 'Barba', 
      time: '16:00', 
      status: 'pending' as const 
    },
  ];

  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.round(change * 10) / 10,
      type: change > 0 ? 'increase' as const : change < 0 ? 'decrease' as const : 'neutral' as const
    };
  };

  return (
    <OnboardingRedirect>
      <PageContainer>
        <div className="space-y-6">
          <OnboardingBannerFixed />
          
          <PageHeader
            title="Dashboard"
            description="Visão geral do seu negócio"
          />

          <Suspense fallback={<DashboardSkeleton />}>
            {/* Métricas principais */}
            <MetricGrid>
              <MetricCard
                title="Receita Total"
                value={mockMetrics.revenue}
                change={calculateChange(mockMetrics.revenue, mockMetrics.previousRevenue)}
                icon={DollarSign}
                format="currency"
                loading={isLoading}
              />
              
              <MetricCard
                title="Agendamentos"
                value={mockMetrics.appointments}
                change={calculateChange(mockMetrics.appointments, mockMetrics.previousAppointments)}
                icon={Calendar}
                loading={isLoading}
              />
              
              <MetricCard
                title="Clientes Ativos"
                value={mockMetrics.clients}
                change={{ value: mockMetrics.newClients, type: 'increase', label: 'novos' }}
                icon={Users}
                loading={isLoading}
              />
              
              <MetricCard
                title="Taxa de Conclusão"
                value={mockMetrics.completionRate}
                change={{ value: 2.1, type: 'increase', label: 'este mês' }}
                icon={TrendingUp}
                format="percentage"
                loading={isLoading}
              />
            </MetricGrid>

            {/* Gráficos e visualizações */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <DashboardChartsUnified />
              </div>
              <div>
                <PopularServices services={isLoading ? [] : popularServices} />
              </div>
            </div>

            {/* Seção inferior */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <NextAppointments appointments={mockAppointments} />
              <BirthdayClients />
              
              {/* Card adicional de resumo */}
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Scissors className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Serviços Ativos</h3>
                    <p className="text-sm text-muted-foreground">Catálogo disponível</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{mockMetrics.services}</span>
                    <span className="text-sm text-muted-foreground">serviços</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Tempo médio: 45min</span>
                  </div>
                </div>
              </div>
            </div>
          </Suspense>
        </div>
      </PageContainer>
    </OnboardingRedirect>
  );
}
