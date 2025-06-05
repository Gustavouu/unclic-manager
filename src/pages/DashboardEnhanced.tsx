
import React, { Suspense } from 'react';
import { OnboardingRedirect } from '@/components/auth/OnboardingRedirect';
import { PageContainer } from '@/components/ui/page-header';
import { Loading } from '@/components/ui/loading';
import { WelcomeBanner } from '@/components/ui/welcome-banner';
import { MetricCardEnhanced, MetricGridEnhanced } from '@/components/ui/metric-card-enhanced';
import { RevenueChartEnhanced } from '@/components/dashboard/RevenueChartEnhanced';
import { QuickActionsPanel } from '@/components/dashboard/QuickActionsPanel';
import { InsightsCard } from '@/components/dashboard/InsightsCard';
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
  Clock,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
    <MetricGridEnhanced>
      {[...Array(4)].map((_, i) => (
        <MetricCardEnhanced 
          key={i}
          title=""
          value=""
          loading={true}
        />
      ))}
    </MetricGridEnhanced>
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Loading size="lg" className="h-96" />
      </div>
      <div>
        <Loading size="lg" className="h-96" />
      </div>
    </div>
  </div>
);

export default function DashboardEnhanced() {
  const { metrics, revenueData, popularServices, isLoading } = useDashboardMetricsOptimized();
  const navigate = useNavigate();

  // Mock data aprimorado para demonstração
  const mockMetrics = {
    revenue: 18750,
    previousRevenue: 15200,
    appointments: 245,
    previousAppointments: 198,
    clients: 312,
    newClients: 28,
    services: 15,
    completionRate: 94.2,
    satisfaction: 4.8
  };

  const mockAppointments = [
    { 
      id: '1', 
      clientName: 'Ana Silva', 
      serviceName: 'Corte + Escova', 
      time: '14:30', 
      status: 'confirmed' as const 
    },
    { 
      id: '2', 
      clientName: 'Carlos Santos', 
      serviceName: 'Barba Completa', 
      time: '15:00', 
      status: 'scheduled' as const 
    },
    { 
      id: '3', 
      clientName: 'Mariana Costa', 
      serviceName: 'Coloração', 
      time: '16:30', 
      status: 'pending' as const 
    },
  ];

  const mockRevenueData = [
    { date: 'Jan', value: 12500, appointments: 156, target: 15000 },
    { date: 'Fev', value: 14200, appointments: 178, target: 15000 },
    { date: 'Mar', value: 16800, appointments: 203, target: 15000 },
    { date: 'Abr', value: 15600, appointments: 189, target: 16000 },
    { date: 'Mai', value: 18200, appointments: 234, target: 16000 },
    { date: 'Jun', value: 18750, appointments: 245, target: 16000 },
  ];

  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.round(change * 10) / 10,
      type: change > 0 ? 'increase' as const : change < 0 ? 'decrease' as const : 'neutral' as const
    };
  };

  const handleGetStarted = () => {
    navigate('/appointments?new=true');
  };

  return (
    <OnboardingRedirect>
      <PageContainer className="space-y-8">
        <div className="space-y-6">
          <OnboardingBannerFixed />
          
          {/* Welcome Banner */}
          <WelcomeBanner
            userName="Maria"
            businessName="Studio Bella"
            onGetStarted={handleGetStarted}
          />

          <Suspense fallback={<DashboardSkeleton />}>
            {/* Métricas principais aprimoradas */}
            <MetricGridEnhanced>
              <MetricCardEnhanced
                title="Receita Total"
                value={mockMetrics.revenue}
                change={calculateChange(mockMetrics.revenue, mockMetrics.previousRevenue)}
                icon={DollarSign}
                format="currency"
                loading={isLoading}
                highlight={true}
                gradient={true}
                tooltip="Receita total do mês atual comparada ao mês anterior"
              />
              
              <MetricCardEnhanced
                title="Agendamentos"
                value={mockMetrics.appointments}
                change={calculateChange(mockMetrics.appointments, mockMetrics.previousAppointments)}
                icon={Calendar}
                loading={isLoading}
                gradient={true}
                tooltip="Total de agendamentos realizados este mês"
              />
              
              <MetricCardEnhanced
                title="Clientes Ativos"
                value={mockMetrics.clients}
                change={{ value: mockMetrics.newClients, type: 'increase', label: 'novos' }}
                icon={Users}
                loading={isLoading}
                gradient={true}
                tooltip="Clientes que fizeram pelo menos um agendamento nos últimos 30 dias"
              />
              
              <MetricCardEnhanced
                title="Satisfação"
                value={mockMetrics.satisfaction}
                change={{ value: 0.3, type: 'increase', label: 'este mês' }}
                icon={Star}
                loading={isLoading}
                gradient={true}
                tooltip="Avaliação média dos clientes (escala de 1 a 5)"
              />
            </MetricGridEnhanced>

            {/* Grid principal com gráfico e ações */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                {/* Gráfico de receita aprimorado */}
                <RevenueChartEnhanced
                  data={mockRevenueData}
                  isLoading={isLoading}
                  showTarget={true}
                  interactive={true}
                />

                {/* Insights inteligentes */}
                <InsightsCard insights={[]} />
              </div>

              <div className="space-y-6">
                {/* Ações rápidas */}
                <QuickActionsPanel compact={true} />
                
                {/* Serviços populares */}
                <PopularServices services={isLoading ? [] : popularServices} />
              </div>
            </div>

            {/* Seção inferior - Widgets informativos */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <NextAppointments appointments={mockAppointments} />
              <BirthdayClients />
              
              {/* Card de performance */}
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-primary/10 p-6 
                            transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Performance Geral</h3>
                    <p className="text-sm text-muted-foreground">Este mês vs anterior</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-primary">
                      {mockMetrics.completionRate}%
                    </span>
                    <span className="text-sm text-green-600 font-medium">+2.1%</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Taxa de conclusão</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Scissors className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{mockMetrics.services} serviços ativos</span>
                    </div>
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
