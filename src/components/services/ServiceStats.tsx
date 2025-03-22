
import { StatCard } from "@/components/dashboard/StatCard";
import { ScissorsSquare, TrendingUp, TrendingDown, Clock } from "lucide-react";
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatCard
        title="Total de Serviços"
        value={totalServices}
        icon={<ScissorsSquare size={18} />}
        iconClassName="bg-purple-100 text-purple-500"
      />
      
      <StatCard
        title="Serviços Populares"
        value={popularServices}
        subtitle={`${Math.round((popularServices / totalServices) * 100) || 0}% do total`}
        icon={<TrendingUp size={18} />}
        iconClassName="bg-blue-100 text-blue-500"
      />
      
      <StatCard
        title="Tempo Médio"
        value={`${averageDuration} min`}
        subtitle={`Preço médio: R$ ${averagePrice}`}
        icon={<Clock size={18} />}
        iconClassName="bg-amber-100 text-amber-500"
      />
    </div>
  );
}
