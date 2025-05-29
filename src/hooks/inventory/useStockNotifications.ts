
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';

interface StockItem {
  id: string;
  name: string;
  currentQuantity: number;
  minQuantity: number;
  unit: string;
}

export const useStockNotifications = () => {
  const [lowStockItems, setLowStockItems] = useState<StockItem[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { businessId } = useTenant();

  useEffect(() => {
    const fetchLowStockItems = async () => {
      if (!businessId) {
        setIsLoading(false);
        return;
      }

      try {
        // Use the correct inventory table with proper column names
        const { data, error } = await supabase
          .from('inventory')
          .select('id, name, quantity, min_quantity')
          .eq('business_id', businessId)
          .lte('quantity', supabase.rpc('min_quantity'));

        if (error) {
          console.error('Error fetching inventory:', error);
          setIsLoading(false);
          return;
        }

        // Filter items where current quantity is at or below minimum
        const lowStock = (data || [])
          .filter(item => item.quantity <= item.min_quantity)
          .map(item => ({
            id: item.id,
            name: item.name || 'Item sem nome',
            currentQuantity: item.quantity || 0,
            minQuantity: item.min_quantity || 5,
            unit: 'un' // Default unit
          }));

        setLowStockItems(lowStock);
        setHasUnreadNotifications(lowStock.length > 0);
        setIsLoading(false);
      } catch (err) {
        console.error('Error in fetchLowStockItems:', err);
        setIsLoading(false);
      }
    };

    fetchLowStockItems();
  }, [businessId]);

  const markNotificationsAsRead = () => {
    setHasUnreadNotifications(false);
  };

  return {
    lowStockItems,
    hasUnreadNotifications,
    isLoading,
    markNotificationsAsRead,
  };
};
