
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

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <OnboardingBanner />

      <DashboardFilters period={period} onPeriodChange={setPeriod} />

      <KpiCards stats={stats} isLoading={loading} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardWidget title="Desempenho Financeiro">
          <FinancialCharts
            revenueData={stats.revenueData}
            isLoading={loading}
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
              services={stats.popularServices}
              isLoading={loading}
            />
          </DashboardWidget>
        </div>

        <div>
          <DashboardWidget title="Comparação de Clientes">
            <ClientsComparisonChart stats={stats} isLoading={loading} />
          </DashboardWidget>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <DashboardWidget title="Insights do Negócio">
            <DashboardInsights stats={stats} isLoading={loading} />
          </DashboardWidget>
        </div>

        <div>
          <RetentionRateCard
            stats={stats}
            isLoading={loading}
          />
        </div>
      </div>

      <StatusFixButton onFix={refresh} />
      <DashboardFooter />
    </div>
  );
};

export default Dashboard;
