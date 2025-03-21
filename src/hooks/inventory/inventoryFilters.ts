
import { InventoryFilterOptions, InventoryItem } from "./types";

export const filterInventory = (
  inventory: InventoryItem[],
  searchTerm: string,
  filterOptions: InventoryFilterOptions
): InventoryItem[] => {
  let result = [...inventory];

  // Filter by search term
  if (searchTerm) {
    result = result.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Filter by category
  if (filterOptions.category !== 'all') {
    result = result.filter(item => item.category === filterOptions.category);
  }

  // Filter by status
  if (filterOptions.status !== 'all') {
    if (filterOptions.status === 'low') {
      result = result.filter(item => item.quantity <= item.minimumQuantity && item.quantity > 0);
    } else if (filterOptions.status === 'out') {
      result = result.filter(item => item.quantity === 0);
    } else if (filterOptions.status === 'in') {
      result = result.filter(item => item.quantity > item.minimumQuantity);
    }
  }

  // Filter by equipment
  if (filterOptions.isEquipment !== null) {
    result = result.filter(item => item.isEquipment === filterOptions.isEquipment);
  }

  return result;
};

export const extractCategories = (inventory: InventoryItem[]): string[] => {
  return [...new Set(inventory.map(item => item.category))];
};
