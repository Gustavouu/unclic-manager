import { StatsCard } from "@/components/common/StatsCard";
import { Users, UserPlus, Star, Clock } from "lucide-react";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Client } from "@/hooks/clients/useClientData";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientStatsProps {
  clients: Client[];
  loading?: boolean;
}

export const ClientStats = ({ clients, loading = false }: ClientStatsProps) => {
  // Exibir skeleton quando estiver carregando
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array(4).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }
  
  // Calculate stats
  const totalClients = clients.length;
  
  // New clients (registered in the last 30 days)
  const thirtyDaysAgo = subDays(new Date(), 30);
  const newClients = clients.filter(client => {
    // In a real app, we'd use a registration date
    // For mock data, we'll use the lastVisit as a proxy for "new" if it's recent
    if (!client.lastVisit) return false;
    return new Date(client.lastVisit) >= thirtyDaysAgo;
  });
  
  // VIP clients (using category as indicator)
  const vipClients = clients.filter(client => 
    client.category === "VIP" || client.category === "Premium"
  );
  
  // Clients without recent visits (inactive for more than 60 days)
  const sixtyDaysAgo = subDays(new Date(), 60);
  const inactiveClients = clients.filter(client => {
    if (!client.lastVisit) return true; // No visit ever recorded
    return new Date(client.lastVisit) < sixtyDaysAgo;
  });

  // Format dates for display
  const today = new Date();
  const formattedToday = format(today, "dd 'de' MMMM", { locale: ptBR });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatsCard 
        title="Total de Clientes"
        value={totalClients.toString()}
        icon={<Users size={20} />}
        description={formattedToday}
        iconColor="bg-blue-50 text-blue-500"
        borderColor="border-l-blue-600"
      />
      
      <StatsCard 
        title="Novos Clientes"
        value={newClients.length.toString()}
        icon={<UserPlus size={20} />}
        description="Últimos 30 dias"
        iconColor="bg-green-50 text-green-500"
        borderColor="border-l-green-600"
      />
      
      <StatsCard 
        title="Clientes VIP"
        value={vipClients.length.toString()}
        icon={<Star size={20} />}
        description="Premium + VIP"
        iconColor="bg-amber-50 text-amber-500"
        borderColor="border-l-amber-600"
      />
      
      <StatsCard 
        title="Sem Visitas Recentes"
        value={inactiveClients.length.toString()}
        icon={<Clock size={20} />}
        description="+60 dias sem visita"
        iconColor="bg-red-50 text-red-500"
        borderColor="border-l-red-600"
      />
    </div>
  );
};
