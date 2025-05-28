
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBusinessOperations = () => {
  const [loading, setLoading] = useState(false);

  const updateBusinessStatus = async (businessId: string, status: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('businesses')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', businessId);

      if (error) throw error;
      
      toast.success('Status do negócio atualizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Error updating business status:', error);
      toast.error('Erro ao atualizar status do negócio');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createBusiness = async (businessData: any) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('businesses')
        .insert({
          name: businessData.name,
          slug: businessData.slug || businessData.name.toLowerCase().replace(/\s+/g, '-'),
          admin_email: businessData.admin_email,
          description: businessData.description,
          phone: businessData.phone,
          address: businessData.address,
          city: businessData.city,
          state: businessData.state,
          zip_code: businessData.zip_code,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Negócio criado com sucesso!');
      return data;
    } catch (error) {
      console.error('Error creating business:', error);
      toast.error('Erro ao criar negócio');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateBusinessStatus,
    createBusiness
  };
};
