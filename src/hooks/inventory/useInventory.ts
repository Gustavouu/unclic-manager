
import { useState, useEffect } from "react";
import { InventoryItem, InventoryFilterOptions } from "./types";
import { mockInventoryItems } from "./mockData";
import { 
  addInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem, 
  restockItem 
} from "./inventoryOperations";
import { filterInventory, extractCategories } from "./inventoryFilters";

export const useInventory = (searchTerm: string) => {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventoryItems);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>(mockInventoryItems);
  const [filterOptions, setFilterOptions] = useState<InventoryFilterOptions>({
    category: 'all',
    status: 'all',
    isEquipment: null
  });

  const categories = extractCategories(inventory);

  // Filter inventory based on search term and filter options
  useEffect(() => {
    const result = filterInventory(inventory, searchTerm, filterOptions);
    setFilteredInventory(result);
  }, [inventory, searchTerm, filterOptions]);

  const updateFilterOptions = (newOptions: Partial<InventoryFilterOptions>) => {
    setFilterOptions(prev => ({ ...prev, ...newOptions }));
  };

  const handleAddInventoryItem = (newItem: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const item = addInventoryItem(inventory, newItem);
    setInventory(prev => [...prev, item]);
    return item;
  };

  const handleUpdateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory(prev => updateInventoryItem(prev, id, updates));
  };

  const handleDeleteInventoryItem = (id: string) => {
    setInventory(prev => deleteInventoryItem(prev, id));
  };

  const handleRestockItem = (id: string, quantity: number) => {
    setInventory(prev => restockItem(prev, id, quantity));
  };

  return {
    inventory,
    filteredInventory,
    categories,
    filterOptions,
    updateFilterOptions,
    addInventoryItem: handleAddInventoryItem,
    updateInventoryItem: handleUpdateInventoryItem,
    deleteInventoryItem: handleDeleteInventoryItem,
    restockItem: handleRestockItem
  };
};
