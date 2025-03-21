
export interface InventoryFormData {
  name: string;
  description: string;
  category: string;
  quantity: string;
  minimumQuantity: string;
  costPrice: string;
  sellingPrice: string;
  supplier: string;
  location: string;
  image: string;
  barcode: string;
  sku: string;
  isEquipment: boolean;
  expirationDate: string;
}

export interface InventoryFormErrors {
  name?: string;
  description?: string;
  category?: string;
  quantity?: string;
  minimumQuantity?: string;
  costPrice?: string;
  sellingPrice?: string;
  supplier?: string;
  location?: string;
  image?: string;
  barcode?: string;
  sku?: string;
  expirationDate?: string;
}

export const validateInventoryForm = (inventory: InventoryFormData): InventoryFormErrors => {
  const errors: InventoryFormErrors = {};
  
  if (!inventory.name.trim()) {
    errors.name = "Nome é obrigatório";
  }
  
  if (!inventory.category) {
    errors.category = "Categoria é obrigatória";
  }
  
  if (!inventory.quantity) {
    errors.quantity = "Quantidade é obrigatória";
  } else {
    const quantityValue = parseInt(inventory.quantity);
    if (isNaN(quantityValue) || quantityValue < 0) {
      errors.quantity = "Quantidade deve ser um número positivo";
    }
  }
  
  if (!inventory.minimumQuantity) {
    errors.minimumQuantity = "Quantidade mínima é obrigatória";
  } else {
    const minQuantityValue = parseInt(inventory.minimumQuantity);
    if (isNaN(minQuantityValue) || minQuantityValue < 0) {
      errors.minimumQuantity = "Quantidade mínima deve ser um número positivo";
    }
  }
  
  if (inventory.costPrice && isNaN(parseFloat(inventory.costPrice))) {
    errors.costPrice = "Preço de custo deve ser um valor numérico";
  }
  
  if (inventory.sellingPrice && isNaN(parseFloat(inventory.sellingPrice))) {
    errors.sellingPrice = "Preço de venda deve ser um valor numérico";
  }
  
  if (inventory.expirationDate) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(inventory.expirationDate)) {
      errors.expirationDate = "Data de validade inválida (use o formato AAAA-MM-DD)";
    }
  }
  
  return errors;
};

export const getEmptyInventoryForm = (): InventoryFormData => ({
  name: "",
  description: "",
  category: "",
  quantity: "0",
  minimumQuantity: "5",
  costPrice: "",
  sellingPrice: "",
  supplier: "",
  location: "",
  image: "",
  barcode: "",
  sku: "",
  isEquipment: false,
  expirationDate: "",
});
