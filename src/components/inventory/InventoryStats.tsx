
import React from 'react';
import { Package, AlertCircle, DollarSign } from 'lucide-react';
import { StatsCard } from '@/components/common/StatsCard';
import { Product } from '@/hooks/inventory/types';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';

interface InventoryStatsProps {
  products: Product[];
}

export const InventoryStats: React.FC<InventoryStatsProps> = ({ products }) => {
  // Calculate statistics for stat cards
  const totalItems = products.length;
  
  const lowStockItems = products.filter(product => 
    product.quantity <= product.minQuantity
  ).length;
  
  const totalValue = products.reduce((sum, product) => 
    sum + (product.price * product.quantity), 0
  ).toFixed(2);

  return (
    <>
      <StatsCard
        title="Total de Produtos"
        value={totalItems.toString()}
        icon={<Package size={18} />}
        iconColor="text-blue-600 bg-blue-50"
        borderColor="border-l-blue-600"
      />
      
      <StatsCard
        title="Estoque Baixo"
        value={lowStockItems.toString()}
        icon={<AlertCircle size={18} />}
        iconColor="text-orange-600 bg-orange-50"
        borderColor="border-l-orange-600"
        description="Produtos abaixo do mínimo"
      />
      
      <StatsCard
        title="Valor Total"
        value={`R$ ${totalValue}`}
        icon={<DollarSign size={18} />}
        iconColor="text-green-600 bg-green-50"
        borderColor="border-l-green-600"
        description="Valor em estoque"
      />
    </>
  );
};
