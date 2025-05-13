
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { DashboardWidget } from '@/components/dashboard/DashboardWidget';
import { FinancialCharts } from '@/components/dashboard/FinancialCharts';
import { PopularServices } from '@/components/dashboard/PopularServices';
import { UpcomingAppointmentsWidget } from '@/components/dashboard/UpcomingAppointmentsWidget';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { ClientsComparisonChart } from '@/components/dashboard/ClientsComparisonChart';
import { RetentionRateCard } from '@/components/dashboard/RetentionRateCard';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { NextAppointments } from '@/components/dashboard/NextAppointments';
import { DashboardInsights } from '@/components/dashboard/DashboardInsights';
import { OnboardingBanner } from '@/components/dashboard/OnboardingBanner';
import { DashboardFooter } from '@/components/dashboard/DashboardFooter';
import { StatusFixButton } from '@/components/dashboard/StatusFixButton';
import { FilterPeriod } from '@/types/dashboard';
import { useDashboardRealtime } from '@/hooks/dashboard/useDashboardRealtime';
import { useAppointments } from '@/hooks/appointments/useAppointments';

const Dashboard = () => {
  const [period, setPeriod] = useState<FilterPeriod>('month');
  const { stats, loading, refresh } = useDashboardRealtime(period);
  const { appointments, isLoading: appointmentsLoading } = useAppointments();

  // Get upcoming appointments for today
  const todayAppointments = appointments
    .filter(appointment => {
      const today = new Date();
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getDate() === today.getDate() &&
        appointmentDate.getMonth() === today.getMonth() &&
        appointmentDate.getFullYear() === today.getFullYear() &&
        appointment.status !== 'cancelado'
      );
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Adjust popularServices to include percentage
  const popularServicesWithPercentage = stats.popularServices.map(service => ({
    ...service,
    percentage: (service.count / Math.max(1, stats.popularServices.reduce((sum, s) => sum + s.count, 0))) * 100
  }));

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <OnboardingBanner onDismiss={() => {}} />

      <DashboardFilters currentPeriod={period} onPeriodChange={setPeriod} />

      <KpiCards data={stats} loading={loading} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardWidget title="Desempenho Financeiro">
          <FinancialCharts
            revenue={stats.revenueData}
            loading={loading}
          />
        </DashboardWidget>

        <DashboardWidget title="Próximos Agendamentos">
          <NextAppointments 
            appointments={todayAppointments.slice(0, 5)}
            isLoading={appointmentsLoading}
          />
        </DashboardWidget>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <DashboardWidget title="Serviços Populares">
            <PopularServices
              services={popularServicesWithPercentage}
              loading={loading}
            />
          </DashboardWidget>
        </div>

        <div>
          <DashboardWidget title="Comparação de Clientes">
            <ClientsComparisonChart data={stats} loading={loading} />
          </DashboardWidget>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <DashboardWidget title="Insights do Negócio">
            <DashboardInsights data={stats} loading={loading} />
          </DashboardWidget>
        </div>

        <div>
          <RetentionRateCard
            retention={stats.retention || 0}
            loading={loading}
          />
        </div>
      </div>

      <StatusFixButton onClick={refresh} />
      <DashboardFooter />
    </div>
  );
};

export default Dashboard;
