
import { useState } from "react";
import { InventoryHeader } from "./InventoryHeader";
import { InventoryTable } from "./InventoryTable";
import { InventoryFilters } from "./InventoryFilters";
import { InventoryDetails } from "./InventoryDetails";
import { NewInventoryDialog } from "./NewInventoryDialog";
import { RestockDialog } from "./RestockDialog";

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
    <div className="space-y-6">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full">
          <InventoryHeader 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          
          <div className="mt-4 bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b">
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
        </div>
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
