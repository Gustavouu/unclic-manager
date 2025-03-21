
export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  quantity: number;
  minimumQuantity: number;
  costPrice?: number;
  sellingPrice?: number;
  supplier?: string;
  location?: string;
  image?: string;
  barcode?: string;
  sku?: string;
  isEquipment: boolean;
  expirationDate?: string;
  lastRestockDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryFilterOptions {
  category: string;
  status: string;
  isEquipment: boolean | null;
}
