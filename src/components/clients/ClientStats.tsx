
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserPlus, Star, Clock } from "lucide-react";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useClientData, Client } from "@/hooks/clients/useClientData"; 

export const ClientStats = () => {
  // Get client data using the hook
  const { clients } = useClientData();
  
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
        icon={<Users size={20} className="text-blue-500" />}
        description={formattedToday}
        trending="neutral"
      />
      
      <StatsCard 
        title="Novos Clientes"
        value={newClients.length.toString()}
        icon={<UserPlus size={20} className="text-green-500" />}
        description="Últimos 30 dias"
        trending={newClients.length > 0 ? "up" : "neutral"}
      />
      
      <StatsCard 
        title="Clientes VIP"
        value={vipClients.length.toString()}
        icon={<Star size={20} className="text-amber-500" />}
        description="Premium + VIP"
        trending={vipClients.length > 5 ? "up" : "neutral"}
      />
      
      <StatsCard 
        title="Sem Visitas Recentes"
        value={inactiveClients.length.toString()}
        icon={<Clock size={20} className="text-red-500" />}
        description="+60 dias sem visita"
        trending={inactiveClients.length > 10 ? "down" : "neutral"}
      />
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  trending: "up" | "down" | "neutral";
}

const StatsCard = ({ title, value, icon, description, trending }: StatsCardProps) => {
  return (
    <Card className="border-l-4 border-l-blue-600">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="bg-blue-50 p-2 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
