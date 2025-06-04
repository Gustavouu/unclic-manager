
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Client, ClientFormData } from '@/types/client';

export const useClientOperations = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateClient = async (clientId: string, clientData: ClientFormData): Promise<Client | null> => {
    setIsSubmitting(true);
    try {
      console.log('Updating client:', clientId, clientData);
      
      const { data, error } = await supabase
        .from('clients')
        .update({
          name: clientData.name,
          email: clientData.email || null,
          phone: clientData.phone || null,
          birth_date: clientData.birth_date || null,
          gender: clientData.gender || null,
          address: clientData.address || null,
          city: clientData.city || null,
          state: clientData.state || null,
          zip_code: clientData.zip_code || null,
          notes: clientData.notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', clientId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast.success('Cliente atualizado com sucesso!');
      return data;
    } catch (error: any) {
      console.error('Error updating client:', error);
      toast.error('Erro ao atualizar cliente');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteClient = async (clientId: string): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      console.log('Deleting client:', clientId);
      
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) {
        throw error;
      }

      toast.success('Cliente excluído com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Error deleting client:', error);
      toast.error('Erro ao excluir cliente');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    updateClient,
    deleteClient,
    isSubmitting,
  };
};
