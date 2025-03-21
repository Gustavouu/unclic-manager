
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import { InventoryItem } from "./types";

export const addInventoryItem = (
  inventory: InventoryItem[],
  newItem: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>
): InventoryItem => {
  const item: InventoryItem = {
    ...newItem,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return item;
};

export const updateInventoryItem = (
  inventory: InventoryItem[],
  id: string,
  updates: Partial<InventoryItem>
): InventoryItem[] => {
  return inventory.map(item => 
    item.id === id 
      ? { ...item, ...updates, updatedAt: new Date().toISOString() } 
      : item
  );
};

export const deleteInventoryItem = (
  inventory: InventoryItem[],
  id: string
): InventoryItem[] => {
  return inventory.filter(item => item.id !== id);
};

export const restockItem = (
  inventory: InventoryItem[],
  id: string,
  quantity: number
): InventoryItem[] => {
  const updatedInventory = inventory.map(item => {
    if (item.id === id) {
      const newQuantity = item.quantity + quantity;
      return {
        ...item,
        quantity: newQuantity,
        lastRestockDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    return item;
  });

  toast({
    title: "Estoque atualizado",
    description: `Quantidade atualizada com sucesso.`
  });

  return updatedInventory;
};
