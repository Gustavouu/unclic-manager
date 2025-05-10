
import React from "react";
import { StatCard } from "@/components/ui/stat-card";
import { ServiceData } from "./servicesData";
import { Grid } from "lucide-react";

interface ServiceStatsProps {
  services: ServiceData[];
}

export function ServiceStats({ services }: ServiceStatsProps) {
  // Calculate statistics
  const totalServices = services.length;
  const activeServices = services.filter(service => service.isActive !== false).length;
  const popularServices = services.filter(service => service.isPopular).length;
  const featuredServices = services.filter(service => service.isFeatured).length;
  
  // Calculate average price
  const averagePrice = services.length
    ? services.reduce((sum, service) => sum + service.price, 0) / services.length
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total de Serviços"
        value={totalServices}
        colorScheme="blue"
        icon={<Grid size={18} className="text-blue-600" />}
      />
      
      <StatCard
        title="Serviços Ativos"
        value={activeServices}
        description={`${Math.round((activeServices / totalServices) * 100)}% do total`}
        colorScheme="green"
        trend={{
          value: Math.round((activeServices / totalServices) * 100),
          direction: "neutral"
        }}
      />
      
      <StatCard
        title="Preço Médio"
        value={`R$ ${averagePrice.toFixed(2)}`}
        colorScheme="amber"
      />
      
      <StatCard
        title="Serviços Populares"
        value={popularServices}
        description={`${Math.round((popularServices / totalServices) * 100)}% do total`}
        colorScheme="purple"
      />
    </div>
  );
}
