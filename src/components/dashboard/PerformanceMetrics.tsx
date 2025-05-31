
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DashboardStats } from '@/types/dashboard';

interface PerformanceMetricsProps {
  stats: DashboardStats;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ stats }) => {
  const completionRate = stats.totalAppointments > 0 
    ? (stats.completedAppointments / stats.totalAppointments) * 100 
    : 0;

  const cancellationRate = stats.totalAppointments > 0
    ? (stats.cancelledAppointments / stats.totalAppointments) * 100
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas de Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Taxa de Conclusão</span>
            <span className="text-sm text-muted-foreground">
              {stats.completedAppointments || 0}/{stats.totalAppointments || 0}
            </span>
          </div>
          <Progress value={completionRate} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {completionRate.toFixed(1)}% dos agendamentos foram concluídos
          </p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Taxa de Cancelamento</span>
            <span className="text-sm text-muted-foreground">
              {stats.cancelledAppointments || 0}/{stats.totalAppointments || 0}
            </span>
          </div>
          <Progress value={cancellationRate} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {cancellationRate.toFixed(1)}% dos agendamentos foram cancelados
          </p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Taxa de Ocupação</span>
            <span className="text-sm text-muted-foreground">{stats.occupancyRate || 0}%</span>
          </div>
          <Progress value={stats.occupancyRate || 0} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};
