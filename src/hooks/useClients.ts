
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';
import { sanitizeFormData } from '@/utils/sanitize';

interface Cliente {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  data_nascimento?: string;
  genero?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  notas?: string;
  id_negocio: string;
}

interface ClienteInput {
  nome: string;
  email?: string;
  telefone?: string;
  data_nascimento?: string;
  genero?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  notas?: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentBusiness } = useTenant();

  /**
   * Fetch clients with secure business filtering
   */
  const fetchClients = useCallback(async () => {
    if (!currentBusiness?.id) {
      setError('Negócio não identificado. Por favor, selecione um negócio.');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch only clients for the current business
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id_negocio', currentBusiness.id)
        .order('nome', { ascending: true });

      if (error) throw error;

      setClients(data || []);
      return data || [];
    } catch (err: any) {
      const errorMsg = err?.message || 'Erro ao buscar clientes';
      setError(errorMsg);
      toast.error('Erro ao carregar clientes', {
        description: errorMsg,
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [currentBusiness?.id]);

  /**
   * Create a new client with secure business assignment
   */
  const createClient = useCallback(async (clientData: ClienteInput) => {
    if (!currentBusiness?.id) {
      const errorMsg = 'Negócio não identificado. Por favor, selecione um negócio.';
      setError(errorMsg);
      toast.error('Erro ao criar cliente', {
        description: errorMsg,
      });
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Sanitize input data
      const sanitizedData = sanitizeFormData(clientData);
      
      // Always assign the current business ID
      const clientWithBusinessId = {
        ...sanitizedData,
        id_negocio: currentBusiness.id
      };

      // Insert the client
      const { data, error } = await supabase
        .from('clientes')
        .insert(clientWithBusinessId)
        .select();

      if (error) throw error;

      const newClient = data?.[0];
      
      if (newClient) {
        setClients(prev => [...prev, newClient]);
        toast.success('Cliente criado com sucesso');
      }
      
      return newClient || null;
    } catch (err: any) {
      const errorMsg = err?.message || 'Erro ao criar cliente';
      setError(errorMsg);
      toast.error('Erro ao criar cliente', {
        description: errorMsg,
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentBusiness?.id]);

  /**
   * Update an existing client with security checks
   */
  const updateClient = useCallback(async (id: string, clientData: Partial<ClienteInput>) => {
    if (!currentBusiness?.id) {
      const errorMsg = 'Negócio não identificado. Por favor, selecione um negócio.';
      setError(errorMsg);
      toast.error('Erro ao atualizar cliente', {
        description: errorMsg,
      });
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Sanitize input data
      const sanitizedData = sanitizeFormData(clientData);
      
      // Verify the client belongs to the current business before updating
      const { data: existingClient, error: fetchError } = await supabase
        .from('clientes')
        .select('id_negocio')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      if (existingClient?.id_negocio !== currentBusiness.id) {
        throw new Error('Você não tem permissão para atualizar este cliente.');
      }

      // Update the client
      const { error } = await supabase
        .from('clientes')
        .update(sanitizedData)
        .eq('id', id)
        .eq('id_negocio', currentBusiness.id); // Extra security to ensure updating only own clients

      if (error) throw error;

      // Update local state
      setClients(prev => prev.map(client => 
        client.id === id ? { ...client, ...sanitizedData } : client
      ));

      toast.success('Cliente atualizado com sucesso');
      return true;
    } catch (err: any) {
      const errorMsg = err?.message || 'Erro ao atualizar cliente';
      setError(errorMsg);
      toast.error('Erro ao atualizar cliente', {
        description: errorMsg,
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentBusiness?.id]);

  /**
   * Delete a client with security checks
   */
  const deleteClient = useCallback(async (id: string) => {
    if (!currentBusiness?.id) {
      const errorMsg = 'Negócio não identificado. Por favor, selecione um negócio.';
      setError(errorMsg);
      toast.error('Erro ao excluir cliente', {
        description: errorMsg,
      });
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Verify the client belongs to the current business before deleting
      const { data: existingClient, error: fetchError } = await supabase
        .from('clientes')
        .select('id_negocio')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      if (existingClient?.id_negocio !== currentBusiness.id) {
        throw new Error('Você não tem permissão para excluir este cliente.');
      }

      // Delete the client
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id)
        .eq('id_negocio', currentBusiness.id); // Extra security to ensure deleting only own clients

      if (error) throw error;

      // Update local state
      setClients(prev => prev.filter(client => client.id !== id));

      toast.success('Cliente excluído com sucesso');
      return true;
    } catch (err: any) {
      const errorMsg = err?.message || 'Erro ao excluir cliente';
      setError(errorMsg);
      toast.error('Erro ao excluir cliente', {
        description: errorMsg,
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentBusiness?.id]);

  /**
   * Search clients with secure business filtering
   */
  const searchClients = useCallback(async (searchTerm: string) => {
    if (!currentBusiness?.id) {
      setError('Negócio não identificado. Por favor, selecione um negócio.');
      return [];
    }

    if (!searchTerm || searchTerm.trim().length < 3) {
      return fetchClients(); // Return all clients if search term is too short
    }

    setLoading(true);
    setError(null);

    try {
      // Sanitize the search term and prepare it for safe search
      const sanitizedTerm = searchTerm.replace(/[%_]/g, '\\$&').trim();
      
      // Search only within the current business's clients
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id_negocio', currentBusiness.id)
        .or(`nome.ilike.%${sanitizedTerm}%,email.ilike.%${sanitizedTerm}%,telefone.ilike.%${sanitizedTerm}%`)
        .order('nome', { ascending: true });

      if (error) throw error;

      setClients(data || []);
      return data || [];
    } catch (err: any) {
      const errorMsg = err?.message || 'Erro ao buscar clientes';
      setError(errorMsg);
      toast.error('Erro na busca de clientes', {
        description: errorMsg,
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [currentBusiness?.id, fetchClients]);

  return {
    clients,
    loading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    searchClients
  };
};
