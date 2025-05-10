
import React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Package, AlertCircle, DollarSign } from 'lucide-react';
import { Product } from '@/hooks/inventory/types';

interface InventoryStatsProps {
  products: Product[];
}

export const InventoryStats = ({ products }: InventoryStatsProps) => {
  const totalItems = products.length;
  
  const lowStockItems = products.filter(product => 
    product.quantity <= product.minQuantity
  ).length;
  
  const totalValue = products.reduce((sum, product) => 
    sum + (product.price * product.quantity), 0
  );

  return (
    <>
      <StatCard
        title="Total de Produtos"
        value={totalItems}
        icon={<Package size={18} />}
        className="h-full"
        iconClassName="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
      />
      
      <StatCard
        title="Estoque Baixo"
        value={lowStockItems}
        icon={<AlertCircle size={18} />}
        className="h-full"
        iconClassName="bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
      />
      
      <StatCard
        title="Valor Total"
        value={`R$ ${totalValue.toFixed(2)}`}
        icon={<DollarSign size={18} />}
        className="h-full"
        iconClassName="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
      />
    </>
  );
}
