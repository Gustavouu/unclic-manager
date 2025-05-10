
import React, { useState } from 'react';
import { InventoryTable } from './InventoryTable';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { NewProductDialog } from './NewProductDialog';
import { useInventory } from '@/hooks/inventory/useInventory';
import { InventoryAnalytics } from './InventoryAnalytics';
import { InventoryFilters } from './InventoryFilters';
import { Product } from '@/hooks/inventory/types';
import { getFormattedDate } from './details/formatters';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { StatsCard } from '@/components/common/StatsCard';
import { Package, AlertCircle, DollarSign } from 'lucide-react';

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

  // Calculate statistics for stat cards
  const totalItems = products.length;
  
  const lowStockItems = products.filter(product => 
    product.quantity <= product.minQuantity
  ).length;
  
  const totalValue = products.reduce((sum, product) => 
    sum + (product.price * product.quantity), 0
  ).toFixed(2);
  
  return (
    <div className="space-y-6">
      <ResponsiveGrid columns={{ default: 1, sm: 3 }} gap="md" equalHeight>
        <StatsCard
          title="Total de Produtos"
          value={totalItems.toString()}
          icon={<Package size={18} />}
          iconColor="text-blue-600 bg-blue-50"
          borderColor="border-l-blue-600"
        />
        
        <StatsCard
          title="Estoque Baixo"
          value={lowStockItems.toString()}
          icon={<AlertCircle size={18} />}
          iconColor="text-orange-600 bg-orange-50"
          borderColor="border-l-orange-600"
          description="Produtos abaixo do mínimo"
        />
        
        <StatsCard
          title="Valor Total"
          value={`R$ ${totalValue}`}
          icon={<DollarSign size={18} />}
          iconColor="text-green-600 bg-green-50"
          borderColor="border-l-green-600"
          description="Valor em estoque"
        />
      </ResponsiveGrid>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-lg font-semibold">Produtos em Estoque</h2>
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
