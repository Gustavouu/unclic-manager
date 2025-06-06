
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { toast } from 'sonner';

export interface InventoryItem {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  quantity: number;
  min_quantity: number;
  cost_price?: number;
  sale_price?: number;
  category_id?: string;
  supplier_id?: string;
  location?: string;
  image_url?: string;
  expiry_date?: string;
  is_equipment: boolean;
  last_restock_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InventoryFormData {
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  quantity: number;
  min_quantity: number;
  cost_price?: number;
  sale_price?: number;
  category_id?: string;
  supplier_id?: string;
  location?: string;
  image_url?: string;
  expiry_date?: string;
  is_equipment?: boolean;
}

export const useInventoryOperations = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { businessId } = useCurrentBusiness();

  const createInventoryItem = async (itemData: InventoryFormData): Promise<InventoryItem | null> => {
    if (!businessId) {
      toast.error('Business ID não encontrado');
      return null;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Creating inventory item:', itemData);
      
      const { data, error } = await supabase
        .from('inventory')
        .insert({
          business_id: businessId,
          name: itemData.name,
          description: itemData.description,
          sku: itemData.sku,
          barcode: itemData.barcode,
          quantity: itemData.quantity,
          min_quantity: itemData.min_quantity,
          cost_price: itemData.cost_price,
          sale_price: itemData.sale_price,
          category_id: itemData.category_id,
          supplier_id: itemData.supplier_id,
          location: itemData.location,
          image_url: itemData.image_url,
          expiry_date: itemData.expiry_date,
          is_equipment: itemData.is_equipment || false,
          last_restock_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast.success('Item adicionado ao inventário!');
      return data;
    } catch (error: any) {
      console.error('Error creating inventory item:', error);
      toast.error('Erro ao adicionar item ao inventário');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateInventoryItem = async (itemId: string, itemData: Partial<InventoryFormData>): Promise<InventoryItem | null> => {
    setIsSubmitting(true);
    try {
      console.log('Updating inventory item:', itemId, itemData);
      
      const { data, error } = await supabase
        .from('inventory')
        .update({
          name: itemData.name,
          description: itemData.description,
          sku: itemData.sku,
          barcode: itemData.barcode,
          quantity: itemData.quantity,
          min_quantity: itemData.min_quantity,
          cost_price: itemData.cost_price,
          sale_price: itemData.sale_price,
          category_id: itemData.category_id,
          supplier_id: itemData.supplier_id,
          location: itemData.location,
          image_url: itemData.image_url,
          expiry_date: itemData.expiry_date,
          is_equipment: itemData.is_equipment,
          updated_at: new Date().toISOString(),
        })
        .eq('id', itemId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast.success('Item atualizado com sucesso!');
      return data;
    } catch (error: any) {
      console.error('Error updating inventory item:', error);
      toast.error('Erro ao atualizar item');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteInventoryItem = async (itemId: string): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      console.log('Deleting inventory item:', itemId);
      
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', itemId);

      if (error) {
        throw error;
      }

      toast.success('Item removido do inventário!');
      return true;
    } catch (error: any) {
      console.error('Error deleting inventory item:', error);
      toast.error('Erro ao remover item');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    isSubmitting,
  };
};
