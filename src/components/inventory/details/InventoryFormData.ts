
import { InventoryFormData } from "../form/inventoryFormValidation";
import { InventoryItem } from "@/hooks/inventory";

export const getInventoryFormData = (item: InventoryItem): InventoryFormData => {
  return {
    name: item.name,
    description: item.description || "",
    category: item.category,
    quantity: item.quantity.toString(),
    minimumQuantity: item.minimumQuantity.toString(),
    costPrice: item.costPrice?.toString() || "",
    sellingPrice: item.sellingPrice?.toString() || "",
    supplier: item.supplier || "",
    location: item.location || "",
    image: item.image || "",
    barcode: item.barcode || "",
    sku: item.sku || "",
    isEquipment: item.isEquipment,
    expirationDate: item.expirationDate || "",
  };
};
