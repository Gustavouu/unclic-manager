
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <InventoryStats products={products} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-4">
        <div className="lg:col-span-3 xl:col-span-2">
          <InventoryAnalytics 
            bestSellers={analytics.bestSellers} 
            needsRestock={analytics.needsRestock} 
            slowMoving={analytics.slowMoving} 
          />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-4 mb-2">
        <h2 className="text-base font-semibold">Produtos em Estoque</h2>
        <div className="flex items-center gap-2">
          <InventoryFilters />
          <Button onClick={() => setIsNewProductOpen(true)} size="sm" className="gap-1 h-8 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Novo Produto
          </Button>
        </div>
      </div>
      
      <InventoryTable 
        products={products} 
        isLoading={isLoading} 
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
      
      <NewProductDialog 
        open={isNewProductOpen} 
        onOpenChange={handleCloseDialog}
        onAddProduct={(data) => {
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
