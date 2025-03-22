
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
    <>
      <Card className="shadow-sm">
        <CardContent className="flex items-center p-3">
          <Package className="w-7 h-7 text-blue-500 mr-3" />
          <div>
            <p className="text-xs text-muted-foreground">Total de Produtos</p>
            <h3 className="text-xl font-bold">{totalItems}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardContent className="flex items-center p-3">
          <AlertCircle className="w-7 h-7 text-orange-500 mr-3" />
          <div>
            <p className="text-xs text-muted-foreground">Estoque Baixo</p>
            <h3 className="text-xl font-bold">{lowStockItems}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardContent className="flex items-center p-3">
          <DollarSign className="w-7 h-7 text-green-500 mr-3" />
          <div>
            <p className="text-xs text-muted-foreground">Valor Total</p>
            <h3 className="text-xl font-bold">R$ {totalValue.toFixed(2)}</h3>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
