
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { useInventoryOperations, type InventoryItem, type InventoryFormData } from './useInventoryOperations';
import { Product } from './types';

export type NewProduct = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

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
        category: item.category_id || 'general',
        price: item.sale_price || 0,
        quantity: item.quantity,
        minQuantity: item.min_quantity,
        supplier: item.supplier_id,
        createdAt: new Date(item.created_at || Date.now()),
        updatedAt: new Date(item.updated_at || Date.now()),
        salesCount: 0, // Would need to calculate from sales data
        lastSoldAt: undefined, // Would need to join with sales data
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

  const addProduct = async (productData: NewProduct) => {
    const inventoryData: InventoryFormData = {
      name: productData.name,
      description: productData.description,
      sku: undefined,
      barcode: undefined,
      quantity: productData.quantity,
      min_quantity: productData.minQuantity,
      cost_price: undefined,
      sale_price: productData.price,
      category_id: productData.category,
      supplier_id: productData.supplier,
      location: undefined,
      image_url: undefined,
      expiry_date: undefined,
      is_equipment: false,
    };

    const result = await createInventoryItem(inventoryData);
    if (result) {
      await fetchInventory(); // Refresh the list
    }
    return result;
  };

  const updateProduct = async (productId: string, productData: Partial<NewProduct>) => {
    const inventoryData: Partial<InventoryFormData> = {
      name: productData.name,
      description: productData.description,
      quantity: productData.quantity,
      min_quantity: productData.minQuantity,
      sale_price: productData.price,
      category_id: productData.category,
      supplier_id: productData.supplier,
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
