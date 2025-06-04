
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { toast } from 'sonner';
import type { Client, ClientFormData } from '@/types/client';

export { type ClientFormData } from '@/types/client';

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
      
      // Try different possible table structures
      let data: any[] = [];
      let fetchError: any = null;

      // Try the 'clients' table first
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (clientsError) {
        console.log('Error from clients table:', clientsError);
        // Try the legacy 'clientes' table
        const { data: clientesData, error: clientesError } = await supabase
          .from('clientes')
          .select('*')
          .eq('id_negocio', businessId)
          .order('criado_em', { ascending: false });

        if (clientesError) {
          console.log('Error from clientes table:', clientesError);
          fetchError = clientesError;
        } else {
          // Map legacy data to new format
          data = clientesData?.map((cliente: any) => ({
            id: cliente.id,
            business_id: cliente.id_negocio,
            name: cliente.nome,
            email: cliente.email,
            phone: cliente.telefone,
            birth_date: cliente.data_nascimento,
            gender: cliente.genero,
            address: cliente.endereco,
            city: cliente.cidade,
            state: cliente.estado,
            zip_code: cliente.cep,
            notes: cliente.notas,
            last_visit: cliente.ultima_visita,
            total_spent: cliente.valor_total_gasto || 0,
            created_at: cliente.criado_em,
            updated_at: cliente.atualizado_em,
            status: 'Ativo' // Default status for legacy records
          })) || [];
        }
      } else {
        data = clientsData || [];
      }

      if (fetchError) {
        throw fetchError;
      }

      console.log('Fetched clients:', data);
      setClients(data);
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
      
      // Try inserting into the clients table first
      const { data, error } = await supabase
        .from('clients')
        .insert([{
          business_id: businessId,
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
          total_spent: 0,
          status: 'Ativo'
        }])
        .select()
        .single();

      if (error) {
        console.log('Error inserting into clients table, trying clientes:', error);
        
        // Try legacy table
        const { data: legacyData, error: legacyError } = await supabase
          .from('clientes')
          .insert([{
            id_negocio: businessId,
            nome: clientData.name,
            email: clientData.email || null,
            telefone: clientData.phone || null,
            data_nascimento: clientData.birth_date || null,
            genero: clientData.gender || null,
            endereco: clientData.address || null,
            cidade: clientData.city || null,
            estado: clientData.state || null,
            cep: clientData.zip_code || null,
            notas: clientData.notes || null,
            valor_total_gasto: 0
          }])
          .select()
          .single();

        if (legacyError) throw legacyError;

        // Map legacy response to Client format
        const mappedClient: Client = {
          id: legacyData.id,
          business_id: legacyData.id_negocio,
          name: legacyData.nome,
          email: legacyData.email,
          phone: legacyData.telefone,
          birth_date: legacyData.data_nascimento,
          gender: legacyData.genero,
          address: legacyData.endereco,
          city: legacyData.cidade,
          state: legacyData.estado,
          zip_code: legacyData.cep,
          notes: legacyData.notas,
          last_visit: legacyData.ultima_visita,
          total_spent: legacyData.valor_total_gasto || 0,
          created_at: legacyData.criado_em,
          updated_at: legacyData.atualizado_em,
          status: 'Ativo'
        };

        await fetchClients(); // Refresh the list
        return mappedClient;
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

  const searchClients = async (searchTerm: string): Promise<Client[]> => {
    if (!businessId || !searchTerm.trim()) {
      return clients;
    }

    try {
      // Try clients table first
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .eq('business_id', businessId)
        .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (clientsError) {
        // Try legacy table
        const { data: clientesData, error: clientesError } = await supabase
          .from('clientes')
          .select('*')
          .eq('id_negocio', businessId)
          .or(`nome.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,telefone.ilike.%${searchTerm}%`)
          .order('criado_em', { ascending: false });

        if (clientesError) throw clientesError;

        // Map legacy data
        return clientesData?.map((cliente: any) => ({
          id: cliente.id,
          business_id: cliente.id_negocio,
          name: cliente.nome,
          email: cliente.email,
          phone: cliente.telefone,
          birth_date: cliente.data_nascimento,
          gender: cliente.genero,
          address: cliente.endereco,
          city: cliente.cidade,
          state: cliente.estado,
          zip_code: cliente.cep,
          notes: cliente.notas,
          last_visit: cliente.ultima_visita,
          total_spent: cliente.valor_total_gasto || 0,
          created_at: cliente.criado_em,
          updated_at: cliente.atualizado_em,
          status: 'Ativo'
        })) || [];
      }

      return clientsData || [];
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
    searchClients,
  };
};
