
import React, { Suspense } from 'react';
import { DashboardMetricsUnified } from '@/components/dashboard/DashboardMetricsUnified';
import { DashboardChartsUnified } from '@/components/dashboard/DashboardChartsUnified';
import { NextAppointments } from '@/components/dashboard/NextAppointments';
import { PopularServices } from '@/components/dashboard/PopularServices';
import { BirthdayClients } from '@/components/dashboard/BirthdayClients';
import { OnboardingBannerFixed } from '@/components/dashboard/OnboardingBannerFixed';
import { PerformanceMonitorWidget } from '@/components/monitoring/PerformanceMonitorWidget';
import { OnboardingRedirect } from '@/components/auth/OnboardingRedirect';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardMetricsOptimized } from '@/hooks/dashboard/useDashboardMetricsOptimized';

// Lazy load do componente de monitoramento para não afetar o carregamento inicial
const LazyPerformanceMonitor = React.lazy(() => 
  import('@/components/monitoring/PerformanceMonitorWidget').then(module => ({
    default: module.PerformanceMonitorWidget
  }))
);

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-24" />
      ))}
    </div>
    <div className="grid gap-6 md:grid-cols-2">
      <Skeleton className="h-80" />
      <Skeleton className="h-80" />
    </div>
    <div className="grid gap-6 md:grid-cols-3">
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
    </div>
  </div>
);

export default function Dashboard() {
  const { popularServices, isLoading } = useDashboardMetricsOptimized();

  // Mock data para appointments
  const mockAppointments = [
    { id: '1', clientName: 'João Silva', serviceName: 'Corte de Cabelo', time: '14:00', status: 'confirmed' as const },
    { id: '2', clientName: 'Maria Santos', serviceName: 'Manicure', time: '15:30', status: 'scheduled' as const },
    { id: '3', clientName: 'Pedro Costa', serviceName: 'Barba', time: '16:00', status: 'pending' as const },
  ];

  return (
    <OnboardingRedirect>
      <div className="space-y-6">
        <OnboardingBannerFixed />
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do seu negócio
          </p>
        </div>

        <Suspense fallback={<DashboardSkeleton />}>
          {/* Métricas principais */}
          <DashboardMetricsUnified />

          {/* Gráficos e visualizações */}
          <div className="grid gap-6 md:grid-cols-2">
            <DashboardChartsUnified />
            <PopularServices services={isLoading ? [] : popularServices} />
          </div>

          {/* Seção inferior */}
          <div className="grid gap-6 md:grid-cols-3">
            <NextAppointments appointments={mockAppointments} />
            <BirthdayClients />
            <div className="space-y-4">
              {/* Espaço para widgets adicionais */}
            </div>
          </div>
        </Suspense>

        {/* Widget de monitoramento de performance */}
        <Suspense fallback={null}>
          <LazyPerformanceMonitor />
        </Suspense>
      </div>
    </OnboardingRedirect>
  );
}
