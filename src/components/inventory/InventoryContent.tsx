
import React, { useState } from 'react';
import { InventoryTable } from './InventoryTable';
import { InventoryStats } from './InventoryStats';
import { InventoryFilters } from './InventoryFilters';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { NewProductDialog } from './NewProductDialog';
import { useInventory } from '@/hooks/inventory/useInventory';
import { InventoryAnalytics } from './InventoryAnalytics';

export const InventoryContent = () => {
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const { products, isLoading, addProduct, getInventoryAnalytics } = useInventory();
  
  const { bestSellers, needsRestock, slowMoving } = getInventoryAnalytics();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <InventoryStats products={products} />
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsNewProductOpen(true)}
            className="whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      {/* Analytics section with bestselling, restock alerts, and slow-moving products */}
      <InventoryAnalytics 
        bestSellers={bestSellers}
        needsRestock={needsRestock}
        slowMoving={slowMoving}
      />

      <InventoryFilters />
      
      <InventoryTable 
        products={products} 
        isLoading={isLoading} 
      />

      <NewProductDialog 
        open={isNewProductOpen} 
        onOpenChange={setIsNewProductOpen}
        onAddProduct={addProduct}
      />
    </div>
  );
}
