
import React, { useState } from 'react';
import { InventoryTable } from './InventoryTable';
import { InventoryStats } from './InventoryStats';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { NewProductDialog } from './NewProductDialog';
import { useInventory } from '@/hooks/inventory/useInventory';
import { WebhookTable } from './WebhookTable';

export const InventoryContent = () => {
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const { products, isLoading, addProduct } = useInventory();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Chave
        </Button>
      </div>
      
      <WebhookTable />
    </div>
  );
}
