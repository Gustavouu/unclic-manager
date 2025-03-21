
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";

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

// Mock data
const mockInventoryItems: InventoryItem[] = [
  {
    id: uuidv4(),
    name: "Shampoo Profissional",
    description: "Shampoo especial para tratamento de cabelos cacheados",
    category: "Cabelo",
    quantity: 15,
    minimumQuantity: 5,
    costPrice: 18.50,
    sellingPrice: 35.90,
    supplier: "Distribuidor ABC",
    location: "Prateleira A3",
    image: "https://placehold.co/100x100",
    barcode: "789012345678",
    sku: "SHAM-PROF-001",
    isEquipment: false,
    expirationDate: "2025-12-31",
    lastRestockDate: "2023-09-15",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: "Condicionador Premium",
    description: "Condicionador para cabelos danificados",
    category: "Cabelo",
    quantity: 12,
    minimumQuantity: 5,
    costPrice: 20.00,
    sellingPrice: 39.90,
    supplier: "Distribuidor ABC",
    location: "Prateleira A4",
    image: "https://placehold.co/100x100",
    barcode: "789012345679",
    sku: "COND-PREM-001",
    isEquipment: false,
    expirationDate: "2025-11-30",
    lastRestockDate: "2023-09-15",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: "Secador Profissional",
    description: "Secador de cabelo 2200W com tecnologia iônica",
    category: "Equipamentos",
    quantity: 3,
    minimumQuantity: 1,
    costPrice: 180.00,
    sellingPrice: 350.00,
    supplier: "Eletrônicos Beauty",
    location: "Armário B1",
    image: "https://placehold.co/100x100",
    barcode: "789012345680",
    sku: "EQUIP-SEC-001",
    isEquipment: true,
    lastRestockDate: "2023-07-10",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: "Chapinha Profissional",
    description: "Chapinha com placas de titânio e temperatura ajustável",
    category: "Equipamentos",
    quantity: 2,
    minimumQuantity: 1,
    costPrice: 150.00,
    sellingPrice: 280.00,
    supplier: "Eletrônicos Beauty",
    location: "Armário B2",
    image: "https://placehold.co/100x100",
    barcode: "789012345681",
    sku: "EQUIP-CHAP-001",
    isEquipment: true,
    lastRestockDate: "2023-07-10",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: "Tintura Loiro Platinado",
    description: "Coloração permanente 10.1",
    category: "Coloração",
    quantity: 8,
    minimumQuantity: 3,
    costPrice: 15.00,
    sellingPrice: 28.50,
    supplier: "ColorTech",
    location: "Prateleira C1",
    image: "https://placehold.co/100x100",
    barcode: "789012345682",
    sku: "TINT-PLAT-101",
    isEquipment: false,
    expirationDate: "2024-06-30",
    lastRestockDate: "2023-10-05",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: "Máscara de Tratamento Intensivo",
    description: "Máscara de hidratação profunda",
    category: "Tratamentos",
    quantity: 4,
    minimumQuantity: 2,
    costPrice: 25.00,
    sellingPrice: 48.90,
    supplier: "Distribuidor ABC",
    location: "Prateleira A5",
    image: "https://placehold.co/100x100",
    barcode: "789012345683",
    sku: "MASC-INT-001",
    isEquipment: false,
    expirationDate: "2025-08-15",
    lastRestockDate: "2023-09-20",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

export const useInventoryData = (searchTerm: string) => {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventoryItems);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>(mockInventoryItems);
  const [filterOptions, setFilterOptions] = useState<InventoryFilterOptions>({
    category: 'all',
    status: 'all',
    isEquipment: null
  });

  const categories = [...new Set(inventory.map(item => item.category))];

  // Filter inventory based on search term and filter options
  useEffect(() => {
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
        result = result.filter(item => item.quantity <= item.minimumQuantity);
      } else if (filterOptions.status === 'out') {
        result = result.filter(item => item.quantity === 0);
      } else if (filterOptions.status === 'in') {
        result = result.filter(item => item.quantity > 0);
      }
    }

    // Filter by equipment
    if (filterOptions.isEquipment !== null) {
      result = result.filter(item => item.isEquipment === filterOptions.isEquipment);
    }

    setFilteredInventory(result);
  }, [inventory, searchTerm, filterOptions]);

  const updateFilterOptions = (newOptions: Partial<InventoryFilterOptions>) => {
    setFilterOptions(prev => ({ ...prev, ...newOptions }));
  };

  const addInventoryItem = (newItem: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const item: InventoryItem = {
      ...newItem,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setInventory(prev => [...prev, item]);
    return item;
  };

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...updates, updatedAt: new Date().toISOString() } 
        : item
    ));
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const restockItem = (id: string, quantity: number) => {
    setInventory(prev => prev.map(item => {
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
    }));

    toast({
      title: "Estoque atualizado",
      description: `Quantidade atualizada com sucesso.`
    });
  };

  return {
    inventory,
    filteredInventory,
    categories,
    filterOptions,
    updateFilterOptions,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    restockItem
  };
};
