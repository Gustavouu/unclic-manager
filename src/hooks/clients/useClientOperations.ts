
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import type { Client, ClientFormData } from '@/types/client';

export const useClientOperations = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { businessId } = useCurrentBusiness();

  const createClient = async (clientData: ClientFormData): Promise<Client | null> => {
    if (!businessId) {
      toast.error('Erro: ID do negócio não encontrado. Faça login novamente.');
      return null;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Creating client with data:', { ...clientData, business_id: businessId });
      
      // Prepare the data for unified table
      const insertData = {
        business_id: businessId,
        name: clientData.name?.trim(),
        email: clientData.email?.toLowerCase().trim() || null,
        phone: clientData.phone?.trim() || null,
        birth_date: clientData.birth_date || null,
        gender: clientData.gender || null,
        address: clientData.address?.trim() || null,
        city: clientData.city?.trim() || null,
        state: clientData.state?.toUpperCase().trim() || null,
        zip_code: clientData.zip_code?.replace(/[^0-9]/g, '') || null,
        notes: clientData.notes?.trim() || null,
        status: 'active',
        total_spent: 0,
        preferences: {},
      };

      // Validate required fields
      if (!insertData.name || insertData.name.length === 0) {
        toast.error('Nome do cliente é obrigatório');
        return null;
      }

      if (insertData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(insertData.email)) {
        toast.error('Email inválido');
        return null;
      }

      const { data, error } = await supabase
        .from('clients_unified')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating client:', error);
        if (error.code === '23505') {
          toast.error('Já existe um cliente com este email');
        } else if (error.code === '42501') {
          toast.error('Sem permissão para criar clientes. Verifique suas credenciais.');
        } else {
          toast.error(`Erro ao criar cliente: ${error.message}`);
        }
        return null;
      }

      if (!data) {
        toast.error('Nenhum dado retornado após criar cliente');
        return null;
      }

      toast.success('Cliente criado com sucesso!');
      console.log('Client created successfully:', data);
      return data as Client;

    } catch (error: any) {
      console.error('Error creating client:', error);
      toast.error(`Erro inesperado: ${error.message || 'Erro desconhecido'}`);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateClient = async (clientId: string, clientData: ClientFormData): Promise<Client | null> => {
    if (!businessId) {
      toast.error('Erro: ID do negócio não encontrado');
      return null;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Updating client:', clientId, clientData);
      
      // Prepare the update data for unified table
      const updateData = {
        name: clientData.name?.trim(),
        email: clientData.email?.toLowerCase().trim() || null,
        phone: clientData.phone?.trim() || null,
        birth_date: clientData.birth_date || null,
        gender: clientData.gender || null,
        address: clientData.address?.trim() || null,
        city: clientData.city?.trim() || null,
        state: clientData.state?.toUpperCase().trim() || null,
        zip_code: clientData.zip_code?.replace(/[^0-9]/g, '') || null,
        notes: clientData.notes?.trim() || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('clients_unified')
        .update(updateData)
        .eq('id', clientId)
        .select()
        .single();

      if (error) {
        console.error('Error updating client:', error);
        toast.error(`Erro ao atualizar cliente: ${error.message}`);
        return null;
      }

      toast.success('Cliente atualizado com sucesso!');
      return data as Client;
    } catch (error: any) {
      console.error('Error updating client:', error);
      toast.error(`Erro inesperado: ${error.message || 'Erro desconhecido'}`);
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
        .from('clients_unified')
        .delete()
        .eq('id', clientId);

      if (error) {
        console.error('Error deleting client:', error);
        toast.error(`Erro ao excluir cliente: ${error.message}`);
        return false;
      }

      toast.success('Cliente excluído com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Error deleting client:', error);
      toast.error(`Erro inesperado: ${error.message || 'Erro desconhecido'}`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createClient,
    updateClient,
    deleteClient,
    isSubmitting,
  };
};
