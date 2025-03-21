
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { InventoryLayout } from "@/components/inventory/InventoryLayout";
import { useToast } from "@/components/ui/use-toast";
import { useInventoryData } from "@/hooks/useInventoryData";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
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
    restockItem
  } = useInventoryData(searchTerm);

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

  const handleRestock = (id: string, quantity: number) => {
    restockItem(id, quantity);
  };

  return (
    <AppLayout title="Estoque">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-xl font-display font-medium">Gerenciamento de Estoque</h1>
      </div>
      
      <InventoryLayout 
        inventory={inventory}
        filteredInventory={filteredInventory}
        categories={categories}
        filterOptions={filterOptions}
        updateFilterOptions={updateFilterOptions}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddItem={handleAddItem}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
        onRestock={handleRestock}
      />
    </AppLayout>
  );
};

export default Inventory;
