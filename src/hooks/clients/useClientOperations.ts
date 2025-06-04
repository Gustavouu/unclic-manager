
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
      
      // Map English field names to Portuguese column names in the database
      const { data, error } = await supabase
        .from('clients')
        .update({
          nome: clientData.name, // Portuguese column name
          email: clientData.email || null,
          telefone: clientData.phone || null, // Portuguese column name
          data_nascimento: clientData.birth_date || null, // Portuguese column name
          genero: clientData.gender || null, // Portuguese column name
          endereco: clientData.address || null, // Portuguese column name
          cidade: clientData.city || null, // Portuguese column name
          estado: clientData.state || null, // Portuguese column name
          cep: clientData.zip_code || null, // Portuguese column name
          notas: clientData.notes || null, // Portuguese column name
          atualizado_em: new Date().toISOString(), // Portuguese column name
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
