import { StatsCard } from "@/components/common/StatsCard";
import { ScissorsSquare, TrendingUp, Clock, Tag } from "lucide-react";
import { ServiceData } from "./servicesData";

interface ServiceStatsProps {
  services: ServiceData[];
}

export function ServiceStats({ services }: ServiceStatsProps) {
  const totalServices = services.length;
  const popularServices = services.filter(service => service.isPopular).length;
  const featuredServices = services.filter(service => service.isFeatured).length;
  
  // Calcular duração média
  const totalDuration = services.reduce((sum, service) => sum + service.duration, 0);
  const averageDuration = totalServices > 0 ? Math.round(totalDuration / totalServices) : 0;
  
  // Calcular preço médio
  const totalPrice = services.reduce((sum, service) => sum + service.price, 0);
  const averagePrice = totalServices > 0 
    ? (totalPrice / totalServices).toFixed(2) 
    : "0.00";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatsCard
        title="Total de Serviços"
        value={totalServices}
        description="Serviços ativos"
        icon={<ScissorsSquare size={18} />}
        iconColor="bg-purple-50 text-purple-500"
        borderColor="border-l-purple-600"
      />
      
      <StatsCard
        title="Serviços Populares"
        value={popularServices}
        description={`${Math.round((popularServices / totalServices) * 100) || 0}% do total`}
        icon={<TrendingUp size={18} />}
        iconColor="bg-blue-50 text-blue-500"
        borderColor="border-l-blue-600"
      />
      
      <StatsCard
        title="Tempo Médio"
        value={`${averageDuration} min`}
        description="Duração média dos serviços"
        icon={<Clock size={18} />}
        iconColor="bg-amber-50 text-amber-500"
        borderColor="border-l-amber-600"
      />
      
      <StatsCard
        title="Preço Médio"
        value={`R$ ${averagePrice}`}
        description="Valor médio dos serviços"
        icon={<Tag size={18} />}
        iconColor="bg-green-50 text-green-500"
        borderColor="border-l-green-600"
      />
    </div>
  );
}
