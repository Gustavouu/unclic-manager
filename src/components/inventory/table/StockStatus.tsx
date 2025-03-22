
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Product } from '@/hooks/inventory/types';

interface StockStatusProps {
  product: Product;
}

export const StockStatus = ({ product }: StockStatusProps) => {
  if (product.quantity <= 0) {
    return <Badge variant="destructive">Sem estoque</Badge>;
  } else if (product.quantity <= product.minQuantity) {
    return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">Estoque baixo</Badge>;
  } else {
    return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Em estoque</Badge>;
  }
};
