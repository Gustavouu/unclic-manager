import React from "react";
import { Users, CalendarClock, DollarSign, Scissors } from "lucide-react";
import { StatsCard } from "@/components/common/StatsCard";
import { DashboardStats } from "@/types/dashboard";
import { formatCurrency } from "@/lib/format";
import { FilterPeriod } from "@/types/dashboard";

interface KpiCardsProps {
  stats: DashboardStats;
  period: FilterPeriod;
}

export function KpiCards({ stats, period }: KpiCardsProps) {
  // Determinar a descrição correta baseada no período selecionado
  const getPeriodDescription = (periodType: FilterPeriod) => {
    switch (periodType) {
      case "today": return "Hoje";
      case "week": return "Esta semana";
      case "month": return "Este mês";
      case "quarter": return "Este trimestre";
      case "year": return "Este ano";
      default: return "Período atual";
    }
  };

  const periodDesc = getPeriodDescription(period);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Clientes Ativos"
        value={stats.clientsCount.toString()}
        description={`Total de clientes`}
        icon={<Users size={18} />}
        iconColor="bg-blue-50 text-blue-500"
        borderColor="border-l-blue-600"
      />
      
      <StatsCard
        title="Próximos Agendamentos"
        value={stats.todayAppointments.toString()}
        description={`Agendamentos próximos`}
        icon={<CalendarClock size={18} />}
        iconColor="bg-indigo-50 text-indigo-500"
        borderColor="border-l-indigo-600"
      />
      
      <StatsCard
        title="Receita"
        value={formatCurrency(stats.monthlyRevenue)}
        description={periodDesc}
        icon={<DollarSign size={18} />}
        iconColor="bg-green-50 text-green-500"
        borderColor="border-l-green-600"
      />
      
      <StatsCard
        title="Serviços Realizados"
        value={stats.monthlyServices.toString()}
        description={periodDesc}
        icon={<Scissors size={18} />}
        iconColor="bg-amber-50 text-amber-500"
        borderColor="border-l-amber-600"
      />
    </div>
  );
}
