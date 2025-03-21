
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { InventoryStats } from "@/components/inventory/InventoryStats";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { InventorySummaryCards } from "@/components/inventory/InventorySummaryCards";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { useToast } from "@/components/ui/use-toast";
import { useInventory } from "@/hooks/inventory";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NewInventoryDialog } from "@/components/inventory/NewInventoryDialog";
import { InventoryDetails } from "@/components/inventory/InventoryDetails";
import { RestockDialog } from "@/components/inventory/RestockDialog";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [restockItem, setRestockItem] = useState(null);
  const { toast } = useToast();
  
  const { 
    inventory, 
    filteredInventory,
    categories,
    filterOptions,
    updateFilterOptions,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    restockItem: handleRestockItemAction
  } = useInventory(searchTerm);

  const handleAddItem = (newItem) => {
    const item = addInventoryItem(newItem);
    
    toast({
      title: "Item adicionado",
      description: `${item.name} foi adicionado ao estoque.`
    });
  };

  const handleUpdateItem = (id: string, updates) => {
    updateInventoryItem(id, updates);
    
    toast({
      title: "Item atualizado",
      description: `As informações do item foram atualizadas.`
    });
  };

  const handleDeleteItem = (id: string) => {
    deleteInventoryItem(id);
    
    toast({
      title: "Item removido",
      description: `O item foi removido do estoque.`
    });
  };

  const handleViewDetails = (id) => {
    setSelectedItemId(id);
    setIsDetailsOpen(true);
  };
  
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setTimeout(() => setSelectedItemId(null), 300);
  };
  
  const handleOpenRestockDialog = (item) => {
    setRestockItem(item);
  };
  
  const handleCloseRestockDialog = () => {
    setRestockItem(null);
  };
  
  const handleRestock = (id: string, quantity: number) => {
    handleRestockItemAction(id, quantity);
    handleCloseRestockDialog();
  };

  // Get the selected item from inventory
  const selectedItem = selectedItemId 
    ? inventory.find(item => item.id === selectedItemId) 
    : null;

  return (
    <AppLayout title="Estoque">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-display font-medium">Estoque</h1>
        <Button onClick={() => document.getElementById("new-inventory-trigger")?.click()}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Produto
        </Button>
      </div>
      
      <div className="space-y-6">
        <InventorySummaryCards inventory={inventory} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InventoryStats 
            inventory={inventory}
            title="Produtos Mais Movimentados"
            emptyMessage="Nenhum produto movimentado recentemente"
            type="recent"
          />
          
          <InventoryStats 
            inventory={inventory}
            title="Produtos Parados"
            emptyMessage="Não há produtos parados"
            type="stopped"
          />
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <InventoryFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              categories={categories}
              filterOptions={filterOptions}
              updateFilterOptions={updateFilterOptions}
            />
          </div>
          
          <InventoryTable 
            items={filteredInventory}
            onViewDetails={handleViewDetails}
            onRestockItem={handleOpenRestockDialog}
            onDeleteItem={handleDeleteItem}
          />
        </div>
      </div>
      
      {/* New Item Dialog */}
      <NewInventoryDialog 
        categories={categories}
        onAddItem={handleAddItem} 
      />
      
      {/* Item Details Drawer */}
      <InventoryDetails
        item={selectedItem}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        onUpdateItem={handleUpdateItem}
        categories={categories}
      />
      
      {/* Restock Dialog */}
      <RestockDialog
        item={restockItem}
        onClose={handleCloseRestockDialog}
        onRestock={handleRestock}
      />
    </AppLayout>
  );
};

export default Inventory;
