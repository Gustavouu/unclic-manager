
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle, Clock, XCircle, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { useAppointments } from '@/hooks/appointments/useAppointments';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/format';
import { Badge } from '@/components/ui/badge';

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

  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate.toDateString() === today.toDateString();
  });

  const stats = {
    total: monthAppointments.length,
    hoje: todayAppointments.length,
    concluidos: monthAppointments.filter(apt => apt.status === 'concluido').length,
    agendados: monthAppointments.filter(apt => apt.status === 'agendado' || apt.status === 'confirmado').length,
    cancelados: monthAppointments.filter(apt => apt.status === 'cancelado').length,
    receita: monthAppointments
      .filter(apt => apt.status === 'concluido')
      .reduce((sum, apt) => sum + apt.price, 0),
    receitaHoje: todayAppointments
      .filter(apt => apt.status === 'concluido')
      .reduce((sum, apt) => sum + apt.price, 0),
  };

  const statCards = [
    {
      title: 'Agendamentos Hoje',
      value: stats.hoje,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: `${stats.total} no mês`,
      badge: stats.hoje > 0 ? 'Ativo' : 'Sem agendamentos',
      badgeVariant: stats.hoje > 0 ? 'default' : 'secondary' as const
    },
    {
      title: 'Concluídos no Mês',
      value: stats.concluidos,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: `${stats.total > 0 ? Math.round((stats.concluidos / stats.total) * 100) : 0}% do total`,
      badge: stats.concluidos > 0 ? 'Produtivo' : 'Baixa',
      badgeVariant: stats.concluidos > 0 ? 'default' : 'secondary' as const
    },
    {
      title: 'Agendados',
      value: stats.agendados,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: `${stats.cancelados} cancelados`,
      badge: stats.agendados > 0 ? 'Agenda Cheia' : 'Disponível',
      badgeVariant: stats.agendados > 5 ? 'default' : 'secondary' as const
    },
    {
      title: 'Receita do Mês',
      value: formatCurrency(stats.receita),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: `${formatCurrency(stats.receitaHoje)} hoje`,
      badge: stats.receita > 1000 ? 'Excelente' : stats.receita > 500 ? 'Bom' : 'Baixo',
      badgeVariant: stats.receita > 1000 ? 'default' : stats.receita > 500 ? 'secondary' : 'outline' as const
    }
  ];

  // Detectar se estamos usando dados de exemplo
  const isUsingSampleData = appointments.some(apt => apt.id.startsWith('sample-'));

  return (
    <div className="space-y-4">
      {isUsingSampleData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-blue-800">
            Exibindo dados de exemplo. Configure sua conta para ver dados reais.
          </span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded ${stat.bgColor}`}>
                    <stat.icon size={16} className={stat.color} />
                  </div>
                  {stat.title}
                </div>
                <Badge variant={stat.badgeVariant} className="text-xs">
                  {stat.badge}
                </Badge>
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
    </div>
  );
}
