
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      <Card>
        <CardContent className="flex items-center p-4">
          <Package className="w-8 h-8 text-blue-500 mr-4" />
          <div>
            <p className="text-sm text-muted-foreground">Total de Produtos</p>
            <h3 className="text-2xl font-bold">{totalItems}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center p-4">
          <AlertCircle className="w-8 h-8 text-orange-500 mr-4" />
          <div>
            <p className="text-sm text-muted-foreground">Estoque Baixo</p>
            <h3 className="text-2xl font-bold">{lowStockItems}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center p-4">
          <DollarSign className="w-8 h-8 text-green-500 mr-4" />
          <div>
            <p className="text-sm text-muted-foreground">Valor Total</p>
            <h3 className="text-2xl font-bold">R$ {totalValue.toFixed(2)}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
