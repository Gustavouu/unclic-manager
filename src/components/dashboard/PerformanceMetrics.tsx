
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DashboardStats } from '@/types/dashboard';
import { formatCurrency } from '@/lib/format';

interface PerformanceMetricsProps {
  stats: DashboardStats | null;
}

export function PerformanceMetrics({ stats }: PerformanceMetricsProps) {
  if (!stats) {
    return null;
  }

  const metrics = [
    {
      title: 'Taxa de Ocupação',
      value: `${stats.occupancyRate}%`,
      change: 5.2,
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(stats.totalRevenue / Math.max(stats.totalAppointments, 1)),
      change: -2.1,
      icon: TrendingDown,
      color: 'text-red-600'
    },
    {
      title: 'Agendamentos Concluídos',
      value: `${stats.completedAppointments}`,
      change: 0,
      icon: Minus,
      color: 'text-gray-600'
    },
    {
      title: 'Taxa de Conversão',
      value: `${Math.round((stats.completedAppointments / Math.max(stats.totalAppointments, 1)) * 100)}%`,
      change: 3.4,
      icon: TrendingUp,
      color: 'text-green-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas de Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const isPositive = metric.change > 0;
            const isNegative = metric.change < 0;
            
            return (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">{metric.title}</h4>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </div>
                
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                  
                  {metric.change !== 0 && (
                    <div className={`flex items-center text-xs ${
                      isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {isPositive && <TrendingUp className="h-3 w-3 mr-1" />}
                      {isNegative && <TrendingDown className="h-3 w-3 mr-1" />}
                      <span>{Math.abs(metric.change)}%</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
