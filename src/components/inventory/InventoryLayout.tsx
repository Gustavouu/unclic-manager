
import { useState } from "react";
import { InventoryTable } from "./InventoryTable";
import { InventoryFilters } from "./InventoryFilters";
import { InventoryDetails } from "./InventoryDetails";
import { NewInventoryDialog } from "./NewInventoryDialog";
import { RestockDialog } from "./RestockDialog";
import { InventorySummaryCards } from "./InventorySummaryCards";
import { InventoryStats } from "./InventoryStats";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const InventoryLayout = ({
  inventory,
  filteredInventory,
  categories,
  filterOptions,
  updateFilterOptions,
  searchTerm,
  setSearchTerm,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onRestock
}) => {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [restockItem, setRestockItem] = useState(null);
  
  // Get the selected item from inventory
  const selectedItem = selectedItemId 
    ? inventory.find(item => item.id === selectedItemId) 
    : null;
  
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
  
  const handleRestock = (id, quantity) => {
    onRestock(id, quantity);
    handleCloseRestockDialog();
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Gestão de Estoque</h1>
        <Button 
          onClick={() => document.getElementById("new-inventory-trigger")?.click()}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Produto
        </Button>
      </div>
      
      <InventorySummaryCards inventory={inventory} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
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
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <InventoryFilters
            categories={categories}
            filterOptions={filterOptions}
            updateFilterOptions={updateFilterOptions}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        
        <InventoryTable 
          items={filteredInventory}
          onViewDetails={handleViewDetails}
          onRestockItem={handleOpenRestockDialog}
          onDeleteItem={onDeleteItem}
        />
      </div>
      
      {/* New Item Dialog */}
      <NewInventoryDialog 
        categories={categories}
        onAddItem={onAddItem} 
      />
      
      {/* Item Details Drawer */}
      <InventoryDetails
        item={selectedItem}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        onUpdateItem={onUpdateItem}
        categories={categories}
      />
      
      {/* Restock Dialog */}
      <RestockDialog
        item={restockItem}
        onClose={handleCloseRestockDialog}
        onRestock={handleRestock}
      />
    </div>
  );
};
