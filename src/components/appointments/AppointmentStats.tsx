
import React from 'react';
import { Calendar, CheckCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { useAppointments } from '@/hooks/appointments/useAppointments';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/format';
import { StatsCard } from '@/components/common/StatsCard';

export function AppointmentStats() {
  const { appointments, isLoading } = useAppointments();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[120px] w-full" />
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
        <StatsCard 
          title="Agendamentos Hoje"
          value={stats.hoje.toString()}
          description={`${stats.total} no mês`}
          icon={<Clock size={18} />}
          iconColor="bg-blue-50 text-blue-500"
          borderColor="border-l-blue-600"
        />
        
        <StatsCard 
          title="Concluídos no Mês"
          value={stats.concluidos.toString()}
          description={`${stats.total > 0 ? Math.round((stats.concluidos / stats.total) * 100) : 0}% do total`}
          icon={<CheckCircle size={18} />}
          iconColor="bg-green-50 text-green-500"
          borderColor="border-l-green-600"
        />
        
        <StatsCard 
          title="Agendados"
          value={stats.agendados.toString()}
          description={`${stats.cancelados} cancelados`}
          icon={<Calendar size={18} />}
          iconColor="bg-orange-50 text-orange-500"
          borderColor="border-l-orange-600"
        />
        
        <StatsCard 
          title="Receita do Mês"
          value={formatCurrency(stats.receita)}
          description={`${formatCurrency(stats.receitaHoje)} hoje`}
          icon={<TrendingUp size={18} />}
          iconColor="bg-emerald-50 text-emerald-500"
          borderColor="border-l-emerald-600"
        />
      </div>
    </div>
  );
}
