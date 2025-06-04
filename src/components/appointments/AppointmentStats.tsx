
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle, Clock, XCircle, Users, TrendingUp } from 'lucide-react';
import { useAppointments } from '@/hooks/useAppointments';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/format';

export function AppointmentStats() {
  const { appointments, isLoading } = useAppointments();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calcular estatísticas
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const monthAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate >= startOfMonth && aptDate <= endOfMonth;
  });

  const stats = {
    total: monthAppointments.length,
    concluidos: monthAppointments.filter(apt => apt.status === 'concluido' || apt.status === 'completed').length,
    agendados: monthAppointments.filter(apt => apt.status === 'agendado' || apt.status === 'scheduled').length,
    cancelados: monthAppointments.filter(apt => apt.status === 'cancelado' || apt.status === 'canceled').length,
    receita: monthAppointments
      .filter(apt => apt.status === 'concluido' || apt.status === 'completed')
      .reduce((sum, apt) => sum + apt.price, 0),
  };

  const statCards = [
    {
      title: 'Total do Mês',
      value: stats.total,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: `${stats.agendados} agendados`
    },
    {
      title: 'Concluídos',
      value: stats.concluidos,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: `${stats.total > 0 ? Math.round((stats.concluidos / stats.total) * 100) : 0}% do total`
    },
    {
      title: 'Cancelados',
      value: stats.cancelados,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: `${stats.total > 0 ? Math.round((stats.cancelados / stats.total) * 100) : 0}% do total`
    },
    {
      title: 'Receita do Mês',
      value: formatCurrency(stats.receita),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: `${stats.concluidos} atendimentos`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <div className={`p-1 rounded ${stat.bgColor}`}>
                <stat.icon size={16} className={stat.color} />
              </div>
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <p className="text-xs text-gray-500">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
