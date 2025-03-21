
import { AppLayout } from "@/components/layout/AppLayout";
import { useInventory } from "@/hooks/inventory";
import { useToast } from "@/components/ui/use-toast";
import { InventoryLayout } from "@/components/inventory/InventoryLayout";

const Inventory = () => {
  const { toast } = useToast();
  
  const { 
    inventory, 
    filteredInventory,
    categories,
    filterOptions,
    updateFilterOptions,
    searchTerm,
    setSearchTerm,
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
  
  const handleRestock = (id: string, quantity: number) => {
    handleRestockItemAction(id, quantity);
    
    toast({
      title: "Estoque atualizado",
      description: `O estoque do item foi atualizado com sucesso.`
    });
  };

  return (
    <AppLayout title="Estoque">
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
