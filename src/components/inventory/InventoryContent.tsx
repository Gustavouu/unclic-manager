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
import { getFormattedDate } from './details/formatters';

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

  const bestSellers = analytics.bestSellers.map(product => ({
    ...product,
    data: product.salesCount || 0
  }));
  
  const needsRestock = analytics.needsRestock.map(product => ({
    ...product,
    data: product.quantity
  }));
  
  const slowMoving = analytics.slowMoving.map(product => ({
    ...product,
    data: product.lastSoldAt ? getFormattedDate(product.lastSoldAt.toString()) : 'Nunca vendido'
  }));
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <InventoryStats products={products} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        <InventoryAnalytics 
          title="Produtos Mais Vendidos"
          icon="trending-up"
          iconColor="text-green-500"
          products={bestSellers} 
          valueLabel="vendas"
          showProgress
        />
        
        <InventoryAnalytics 
          title="Alerta de Reposição"
          icon="alert-triangle"
          iconColor="text-orange-500"
          products={needsRestock} 
          valueLabel="unidades"
          showMinThreshold
        />
        
        <InventoryAnalytics 
          title="Produtos com Baixa Rotatividade"
          icon="clock"
          iconColor="text-blue-500"
          products={slowMoving} 
          valueLabel="última venda"
          showMinThreshold
        />
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
