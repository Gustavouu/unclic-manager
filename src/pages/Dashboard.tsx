
import { Users, Calendar, DollarSign, Scissors } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { AppointmentCalendar } from "@/components/dashboard/Calendar";
import { FinancialChart } from "@/components/dashboard/FinancialChart";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 animate-fade-in">
      <StatCard
        title="Total de Clientes"
        value="128"
        subtitle="Clientes cadastrados"
        icon={<Users size={18} />}
        trend={{ value: 12, isPositive: true }}
      />
      
      <StatCard
        title="Agendamentos Hoje"
        value="8"
        subtitle="Horários marcados"
        icon={<Calendar size={18} />}
        iconClassName="bg-blue-50 text-blue-600"
      />
      
      <StatCard
        title="Faturamento Mensal"
        value="R$ 8.459,00"
        subtitle="Mês atual"
        icon={<DollarSign size={18} />}
        trend={{ value: 8, isPositive: true }}
        iconClassName="bg-green-50 text-green-600"
      />
      
      <StatCard
        title="Serviços Realizados"
        value="93"
        subtitle="Este mês"
        icon={<Scissors size={18} />}
        trend={{ value: 4, isPositive: true }}
        iconClassName="bg-amber-50 text-amber-600"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 col-span-1 md:col-span-2 lg:col-span-4">
        <AppointmentCalendar />
        <FinancialChart />
      </div>
    </div>
  );
};

export default Dashboard;
