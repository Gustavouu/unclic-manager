
import React, { useState } from 'react';
import { InventoryTable } from './InventoryTable';
import { InventoryStats } from './InventoryStats';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { NewProductDialog } from './NewProductDialog';
import { useInventory } from '@/hooks/inventory/useInventory';
import { InventoryAnalytics } from './InventoryAnalytics';
import { InventoryFilters } from './InventoryFilters';
import { Product } from '@/hooks/inventory/types';

export const InventoryContent = () => {
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { 
    products, 
    isLoading, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    getInventoryAnalytics 
  } = useInventory();
  
  const analytics = getInventoryAnalytics();
  
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsNewProductOpen(true);
  };
  
  const handleDeleteProduct = (product: Product) => {
    if (window.confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
      deleteProduct(product.id);
    }
  };
  
  const handleCloseDialog = () => {
    setIsNewProductOpen(false);
    setEditingProduct(null);
  };
  
  return (
    <div className="space-y-8">
      <InventoryStats products={products} />
      
      <InventoryAnalytics 
        bestSellers={analytics.bestSellers} 
        needsRestock={analytics.needsRestock} 
        slowMoving={analytics.slowMoving} 
      />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold">Produtos em Estoque</h2>
        <Button onClick={() => setIsNewProductOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Produto
        </Button>
      </div>
      
      <InventoryFilters />
      
      <InventoryTable 
        products={products} 
        isLoading={isLoading} 
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
      
      <NewProductDialog 
        open={isNewProductOpen} 
        onOpenChange={handleCloseDialog}
        onSubmit={(data) => {
          if (editingProduct) {
            updateProduct(editingProduct.id, data);
          } else {
            addProduct(data);
          }
          handleCloseDialog();
        }}
        product={editingProduct}
      />
    </div>
  );
}
