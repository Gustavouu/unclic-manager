
import { Client } from "@/hooks/useClients";
import { StatCard } from "@/components/dashboard/StatCard";
import { Users, CreditCard, Calendar } from "lucide-react";
import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid";

interface ClientStatsProps {
  clients: Client[];
}

export function ClientStats({ clients }: ClientStatsProps) {
  const totalClients = clients.length;
  
  // Calculate active clients (visited in last 30 days)
  const activeClients = clients.filter(client => {
    if (!client.last_visit && !client.ultima_visita) return false;
    const lastVisitDate = client.last_visit || client.ultima_visita;
    if (!lastVisitDate) return false;
    
    const lastVisit = new Date(lastVisitDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastVisit >= thirtyDaysAgo;
  }).length;
  
  // Calculate total spent by all clients
  const totalSpent = clients.reduce((sum, client) => {
    const spent = client.total_spent || client.valor_total_gasto || 0;
    return sum + spent;
  }, 0);
  
  // Calculate average appointments per client
  const totalAppointments = clients.reduce((sum, client) => {
    const appointments = client.total_appointments || client.total_agendamentos || 0;
    return sum + appointments;
  }, 0);
  
  const avgAppointments = totalClients > 0 
    ? (totalAppointments / totalClients).toFixed(1) 
    : '0.0';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <ResponsiveGrid columns={{ default: 1, sm: 4 }} gap="md" equalHeight>
      <StatCard
        title="Total de Clientes"
        value={totalClients}
        icon={<Users size={18} />}
        className="h-full"
        iconClassName="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
      />
      
      <StatCard
        title="Clientes Ativos"
        value={activeClients}
        subtitle="Visitaram nos últimos 30 dias"
        icon={<Users size={18} />}
        className="h-full"
        iconClassName="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
      />
      
      <StatCard
        title="Faturamento"
        value={formatCurrency(totalSpent)}
        icon={<CreditCard size={18} />}
        className="h-full"
        iconClassName="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
      />
      
      <StatCard
        title="Agendamentos Médios"
        value={avgAppointments}
        subtitle="Por cliente"
        icon={<Calendar size={18} />}
        className="h-full"
        iconClassName="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
      />
    </ResponsiveGrid>
  );
}
