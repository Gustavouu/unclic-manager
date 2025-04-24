
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { HelpCircle, Plus } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InventoryStats } from '@/components/inventory/InventoryStats';
import { InventoryTable } from '@/components/inventory/InventoryTable';
import { NewProductDialog } from '@/components/inventory/NewProductDialog';
import { useInventory } from '@/hooks/inventory/useInventory';
import { Product } from '@/hooks/inventory/types';

export default function Inventory() {
  const [showNewProductDialog, setShowNewProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const { 
    products, 
    isLoading, 
    addProduct, 
    updateProduct, 
    deleteProduct 
  } = useInventory();

  const handleAddOrUpdateProduct = (data: any) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      addProduct(data);
    }
    setShowNewProductDialog(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowNewProductDialog(true);
  };

  const handleDelete = (product: Product) => {
    if (window.confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
      deleteProduct(product.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Inventário</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie seu estoque e produtos
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 text-xs h-9">
                <HelpCircle className="h-3 w-3" />
                Dicas gerais
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-3" side="left">
              <div className="space-y-3 text-xs">
                <div>
                  <h3 className="font-medium flex items-center gap-1.5">
                    <span className="bg-blue-100 text-blue-700 p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    </span>
                    Controle de Estoque
                  </h3>
                  <p className="text-xs text-muted-foreground ml-6">
                    Monitore seus produtos, defina alertas de estoque baixo e gerencie seu inventário.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium flex items-center gap-1.5">
                    <span className="bg-green-100 text-green-700 p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                    </span>
                    Benefícios
                  </h3>
                  <p className="text-xs text-muted-foreground ml-6">
                    Evite quebras de estoque, reduza custos e otimize seu investimento.
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            onClick={() => setShowNewProductDialog(true)}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus size={16} />
            Novo Produto
          </Button>
        </div>
      </div>
      
      <InventoryStats products={products} />

      <Card className="border shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b bg-white">
          <CardTitle className="text-lg">Produtos em Estoque</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
              <TabsList className="bg-slate-100">
                <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="low" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Estoque Baixo
                </TabsTrigger>
                <TabsTrigger value="out" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Sem Estoque
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-0">
              <InventoryTable 
                products={products} 
                isLoading={isLoading} 
                filterType="all"
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>
            
            <TabsContent value="low" className="mt-0">
              <InventoryTable 
                products={products} 
                isLoading={isLoading} 
                filterType="low"
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>
            
            <TabsContent value="out" className="mt-0">
              <InventoryTable 
                products={products} 
                isLoading={isLoading} 
                filterType="out"
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <NewProductDialog 
        open={showNewProductDialog}
        onOpenChange={setShowNewProductDialog}
        onAddProduct={handleAddOrUpdateProduct}
        product={editingProduct}
      />
    </div>
  );
}
