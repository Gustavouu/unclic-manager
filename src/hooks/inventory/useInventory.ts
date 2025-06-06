
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { useInventoryOperations, type InventoryItem, type InventoryFormData } from './useInventoryOperations';

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  quantity: number;
  minQuantity: number;
  price: number;
  costPrice?: number;
  category?: string;
  supplier?: string;
  location?: string;
  imageUrl?: string;
  expiryDate?: string;
  isEquipment: boolean;
  lastSoldAt?: Date;
  salesCount?: number;
  created_at?: string;
  updated_at?: string;
}

interface InventoryAnalytics {
  totalValue: number;
  lowStockItems: number;
  totalItems: number;
  bestSellers: Product[];
  needsRestock: Product[];
  slowMoving: Product[];
}

export const useInventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useCurrentBusiness();
  const { createInventoryItem, updateInventoryItem, deleteInventoryItem } = useInventoryOperations();

  const fetchInventory = async () => {
    if (!businessId) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching inventory for business:', businessId);
      
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('inventory')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (inventoryError) {
        throw inventoryError;
      }

      console.log('Fetched inventory:', inventoryData);
      
      // Map inventory data to Product interface
      const mappedProducts = (inventoryData || []).map((item: InventoryItem) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        sku: item.sku,
        barcode: item.barcode,
        quantity: item.quantity,
        minQuantity: item.min_quantity,
        price: item.sale_price || 0,
        costPrice: item.cost_price,
        category: item.category_id,
        supplier: item.supplier_id,
        location: item.location,
        imageUrl: item.image_url,
        expiryDate: item.expiry_date,
        isEquipment: item.is_equipment,
        lastSoldAt: undefined, // Would need to join with sales data
        salesCount: 0, // Would need to calculate from sales data
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
      
      setProducts(mappedProducts);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [businessId]);

  const addProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const inventoryData: InventoryFormData = {
      name: productData.name,
      description: productData.description,
      sku: productData.sku,
      barcode: productData.barcode,
      quantity: productData.quantity,
      min_quantity: productData.minQuantity,
      cost_price: productData.costPrice,
      sale_price: productData.price,
      category_id: productData.category,
      supplier_id: productData.supplier,
      location: productData.location,
      image_url: productData.imageUrl,
      expiry_date: productData.expiryDate,
      is_equipment: productData.isEquipment,
    };

    const result = await createInventoryItem(inventoryData);
    if (result) {
      await fetchInventory(); // Refresh the list
    }
    return result;
  };

  const updateProduct = async (productId: string, productData: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>) => {
    const inventoryData: Partial<InventoryFormData> = {
      name: productData.name,
      description: productData.description,
      sku: productData.sku,
      barcode: productData.barcode,
      quantity: productData.quantity,
      min_quantity: productData.minQuantity,
      cost_price: productData.costPrice,
      sale_price: productData.price,
      category_id: productData.category,
      supplier_id: productData.supplier,
      location: productData.location,
      image_url: productData.imageUrl,
      expiry_date: productData.expiryDate,
      is_equipment: productData.isEquipment,
    };

    const result = await updateInventoryItem(productId, inventoryData);
    if (result) {
      await fetchInventory(); // Refresh the list
    }
    return result;
  };

  const deleteProduct = async (productId: string) => {
    const success = await deleteInventoryItem(productId);
    if (success) {
      await fetchInventory(); // Refresh the list
    }
    return success;
  };

  const getInventoryAnalytics = (): InventoryAnalytics => {
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const lowStockItems = products.filter(product => product.quantity <= product.minQuantity).length;
    const totalItems = products.length;
    
    // For now, using mock data for complex analytics
    // In a real implementation, these would be calculated from sales data
    const bestSellers = products.slice(0, 5).map(product => ({
      ...product,
      salesCount: Math.floor(Math.random() * 100)
    }));
    
    const needsRestock = products.filter(product => product.quantity <= product.minQuantity).slice(0, 5);
    
    const slowMoving = products.slice(-5).map(product => ({
      ...product,
      lastSoldAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    }));

    return {
      totalValue,
      lowStockItems,
      totalItems,
      bestSellers,
      needsRestock,
      slowMoving,
    };
  };

  const refetch = () => {
    fetchInventory();
  };

  return {
    products,
    isLoading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    getInventoryAnalytics,
    refetch,
  };
};
