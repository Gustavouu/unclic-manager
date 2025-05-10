
import React from 'react';
import { ServiceData } from './servicesData';
import { StatCard } from "@/components/dashboard/StatCard";
import { Scissors, Calendar, BadgeDollarSign, Bookmark } from "lucide-react";
import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid";
import { formatCurrency } from "@/lib/formatters";

interface ServiceStatsProps {
  services: ServiceData[];
}

export const ServiceStats: React.FC<ServiceStatsProps> = ({ services }) => {
  const totalServices = services.length;
  
  // Calculate total estimated revenue
  const totalRevenue = services.reduce((sum, service) => {
    // Handle price based on its type
    let price: number;
    if (typeof service.price === 'string') {
      price = parseFloat(service.price.replace(/[^\d.,]/g, '').replace(',', '.'));
    } else {
      price = service.price;
    }
    return sum + (isNaN(price) ? 0 : price);
  }, 0);
  
  // Calculate average duration
  const totalDuration = services.reduce((sum, service) => {
    return sum + (service.duration || 0);
  }, 0);
  
  const averageDuration = services.length ? Math.round(totalDuration / services.length) : 0;
  
  // Count active services (checking for isActive property since status is not available)
  const activeServices = services.filter(service => service.isActive !== false).length;

  return (
    <ResponsiveGrid columns={{ default: 1, sm: 4 }} gap="md" equalHeight>
      <StatCard
        title="Total de Serviços"
        value={totalServices}
        icon={<Scissors size={18} />}
        className="h-full"
        iconClassName="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
      />
      
      <StatCard
        title="Serviços Ativos"
        value={activeServices}
        subtitle={`${Math.round((activeServices / totalServices) * 100) || 0}% do total`}
        icon={<Bookmark size={18} />}
        className="h-full"
        iconClassName="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
      />
      
      <StatCard
        title="Duração Média"
        value={`${averageDuration} min`}
        icon={<Calendar size={18} />}
        className="h-full"
        iconClassName="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
      />
      
      <StatCard
        title="Receita Estimada"
        value={formatCurrency(totalRevenue)}
        icon={<BadgeDollarSign size={18} />}
        className="h-full"
        iconClassName="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
      />
    </ResponsiveGrid>
  );
};
