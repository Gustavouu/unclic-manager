
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Product } from '@/hooks/inventory/types';

interface StockStatusProps {
  product: Product;
}

export const StockStatus = ({ product }: StockStatusProps) => {
  // Determine status based on quantity relation to minQuantity
  const isLowStock = product.quantity <= product.minQuantity;
  const isOutOfStock = product.quantity === 0;
  
  if (isOutOfStock) {
    return (
      <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5">
        Sem estoque
      </Badge>
    );
  }
  
  if (isLowStock) {
    return (
      <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200 text-[10px] px-1.5 py-0.5">
        Estoque baixo
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 text-[10px] px-1.5 py-0.5">
      Em estoque
    </Badge>
  );
};
