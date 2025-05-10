
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import { toast } from "sonner";

export interface LowStockItem {
  id: string;
  name: string;
  currentQuantity: number;
  minQuantity: number;
  unit: string;
}

export function useStockNotifications() {
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(false);
  const { businessId } = useCurrentBusiness();

  // Function to fetch low stock items
  const fetchLowStockItems = async () => {
    if (!businessId) return;
    
    setIsLoading(true);
    try {
      // Try stock_items table first (new schema)
      let { data: stockItems, error: stockItemsError } = await supabase
        .from('stock_items')
        .select(`
          id, 
          quantity,
          products:productId (id, name, minStock, unit)
        `)
        .eq('tenantId', businessId);
      
      if (stockItemsError || !stockItems?.length) {
        console.log("Falling back to estoque table");
        // Fallback to estoque table (old schema)
        const { data: estoqueItems, error: estoqueError } = await supabase
          .from('estoque')
          .select('id, nome, quantidade, quantidade_minima')
          .eq('id_negocio', businessId);
          
        if (estoqueError) throw estoqueError;
        
        const lowItems = estoqueItems
          ?.filter(item => item.quantidade < item.quantidade_minima)
          .map(item => ({
            id: item.id,
            name: item.nome,
            currentQuantity: item.quantidade,
            minQuantity: item.quantidade_minima,
            unit: "unidade"
          })) || [];
          
        setLowStockItems(lowItems);
        if (lowItems.length > 0) {
          setHasUnreadNotifications(true);
        }
      } else {
        // Process stock_items data
        const lowItems = stockItems
          .filter(item => {
            const product = item.products;
            return product && item.quantity < (product?.minStock || 0);
          })
          .map(item => ({
            id: item.id,
            name: item.products?.name || "Produto sem nome",
            currentQuantity: item.quantity,
            minQuantity: item.products?.minStock || 0,
            unit: item.products?.unit || "unidade"
          }));
          
        setLowStockItems(lowItems);
        if (lowItems.length > 0) {
          setHasUnreadNotifications(true);
        }
      }
    } catch (error) {
      console.error("Error fetching low stock items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark notifications as read
  const markNotificationsAsRead = () => {
    setHasUnreadNotifications(false);
  };

  // Show a toast notification when low stock items are detected
  useEffect(() => {
    if (lowStockItems.length > 0 && hasUnreadNotifications) {
      toast.warning(`${lowStockItems.length} produtos com estoque baixo`, {
        description: "Alguns produtos precisam de reposição",
        action: {
          label: "Ver",
          onClick: () => window.location.href = "/inventory",
        },
      });
    }
  }, [lowStockItems, hasUnreadNotifications]);

  // Fetch low stock items on component mount and when businessId changes
  useEffect(() => {
    fetchLowStockItems();
    
    // Set up real-time subscription for stock updates
    if (businessId) {
      const stockChannel = supabase
        .channel('stock-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'stock_items',
            filter: `tenantId=eq.${businessId}`
          },
          () => {
            fetchLowStockItems();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(stockChannel);
      };
    }
  }, [businessId]);

  return {
    lowStockItems,
    isLoading,
    hasUnreadNotifications,
    markNotificationsAsRead,
    refreshStockItems: fetchLowStockItems
  };
}
