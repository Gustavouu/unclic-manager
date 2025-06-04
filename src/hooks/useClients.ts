
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { toast } from 'sonner';
import type { Client, ClientFormData } from '@/types/client';

// Re-export types for external use
export { type Client, type ClientFormData } from '@/types/client';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useCurrentBusiness();

  const fetchClients = async () => {
    if (!businessId) {
      setClients([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching clients for business:', businessId);
      
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .eq('id_negocio', businessId)
        .order('criado_em', { ascending: false });

      if (clientsError) {
        console.log('Error from clients table:', clientsError);
        throw clientsError;
      }

      console.log('Fetched clients:', clientsData);
      setClients(clientsData || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch clients');
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [businessId]);

  const createClient = async (clientData: ClientFormData): Promise<Client | null> => {
    if (!businessId) {
      toast.error('Business ID não encontrado');
      return null;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Creating client with data:', clientData);
      
      // Map English field names to Portuguese column names in the database
      const { data, error } = await supabase
        .from('clients')
        .insert([{
          id_negocio: businessId, // Portuguese column name
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
          valor_total_gasto: 0, // Portuguese column name
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      await fetchClients(); // Refresh the list
      return data;
    } catch (error: any) {
      console.error('Error creating client:', error);
      toast.error('Erro ao criar cliente');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const findClientByEmail = async (email: string): Promise<Client | null> => {
    if (!businessId || !email.trim()) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id_negocio', businessId)
        .eq('email', email)
        .single();

      if (error) {
        console.log('Client not found by email:', email);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error finding client by email:', error);
      return null;
    }
  };

  const searchClients = async (searchTerm: string): Promise<Client[]> => {
    if (!businessId || !searchTerm.trim()) {
      return clients;
    }

    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id_negocio', businessId)
        .or(`nome.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,telefone.ilike.%${searchTerm}%`)
        .order('criado_em', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error searching clients:', error);
      return [];
    }
  };

  return {
    clients,
    isLoading,
    isSubmitting,
    error,
    refetch: fetchClients,
    createClient,
    findClientByEmail,
    searchClients,
  };
};
