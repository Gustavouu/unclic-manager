
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { toast } from 'sonner';
import type { Client, ClientFormData } from '@/types/client';

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { businessId } = useCurrentBusiness();

  const fetchClients = async () => {
    if (!businessId) {
      console.log('No business ID available for fetching clients');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`Fetching clients for business: ${businessId}`);
      
      // Query the clients table using standardized English field names
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }

      console.log('Raw clients data:', data);

      // Map the database fields to the expected Client interface
      const mappedClients: Client[] = (data || []).map(client => ({
        id: client.id,
        business_id: client.business_id,
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        birth_date: client.birth_date || '',
        gender: client.gender || '',
        address: client.address || '',
        city: client.city || '',
        state: client.state || '',
        zip_code: client.zip_code || '',
        notes: client.notes || '',
        created_at: client.created_at,
        updated_at: client.updated_at,
        last_visit: client.last_visit,
        total_spent: client.total_spent || 0,
        status: client.status || 'active',
        preferences: typeof client.preferences === 'object' && client.preferences !== null 
          ? client.preferences as Record<string, any>
          : {}
      }));

      console.log('Mapped clients:', mappedClients);
      setClients(mappedClients);
    } catch (err: any) {
      console.error('Error in fetchClients:', err);
      setError(err.message || 'Failed to fetch clients');
      toast.error('Erro ao carregar clientes');
    } finally {
      setIsLoading(false);
    }
  };

  const createClient = async (clientData: ClientFormData): Promise<Client> => {
    if (!businessId) {
      throw new Error('Business ID is required');
    }

    console.log('Creating client with data:', clientData);

    // Map form data to database schema using both English and Portuguese fields
    const dbData = {
      business_id: businessId,
      id_negocio: businessId, // Portuguese field for compatibility
      name: clientData.name,
      nome: clientData.name, // Portuguese field for compatibility
      email: clientData.email || null,
      phone: clientData.phone || null,
      telefone: clientData.phone || null, // Portuguese field for compatibility
      birth_date: clientData.birth_date || null,
      data_nascimento: clientData.birth_date || null, // Portuguese field for compatibility
      gender: clientData.gender || null,
      genero: clientData.gender || null, // Portuguese field for compatibility
      address: clientData.address || null,
      endereco: clientData.address || null, // Portuguese field for compatibility
      city: clientData.city || null,
      cidade: clientData.city || null, // Portuguese field for compatibility
      state: clientData.state || null,
      estado: clientData.state || null, // Portuguese field for compatibility
      zip_code: clientData.zip_code || null,
      cep: clientData.zip_code || null, // Portuguese field for compatibility
      notes: clientData.notes || null,
      notas: clientData.notes || null, // Portuguese field for compatibility
      status: 'active',
      total_spent: 0,
      valor_total_gasto: 0, // Portuguese field for compatibility
      preferences: {},
      preferencias: {} // Portuguese field for compatibility
    };

    const { data, error } = await supabase
      .from('clients')
      .insert(dbData)
      .select()
      .single();

    if (error) {
      console.error('Error creating client:', error);
      throw error;
    }

    console.log('Created client:', data);

    // Map response back to Client interface
    const newClient: Client = {
      id: data.id,
      business_id: data.business_id,
      name: data.name,
      email: data.email || '',
      phone: data.phone || '',
      birth_date: data.birth_date || '',
      gender: data.gender || '',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      zip_code: data.zip_code || '',
      notes: data.notes || '',
      created_at: data.created_at,
      updated_at: data.updated_at,
      last_visit: data.last_visit,
      total_spent: data.total_spent || 0,
      status: data.status || 'active',
      preferences: typeof data.preferences === 'object' && data.preferences !== null 
        ? data.preferences as Record<string, any>
        : {}
    };

    // Update local state
    setClients(prev => [newClient, ...prev]);
    return newClient;
  };

  const updateClient = async (id: string, clientData: Partial<ClientFormData>): Promise<Client> => {
    console.log('Updating client:', id, clientData);

    // Map form data to database schema using both English and Portuguese fields
    const dbData: any = {};
    if (clientData.name !== undefined) {
      dbData.name = clientData.name;
      dbData.nome = clientData.name; // Portuguese field for compatibility
    }
    if (clientData.email !== undefined) dbData.email = clientData.email;
    if (clientData.phone !== undefined) {
      dbData.phone = clientData.phone;
      dbData.telefone = clientData.phone; // Portuguese field for compatibility
    }
    if (clientData.birth_date !== undefined) {
      dbData.birth_date = clientData.birth_date;
      dbData.data_nascimento = clientData.birth_date; // Portuguese field for compatibility
    }
    if (clientData.gender !== undefined) {
      dbData.gender = clientData.gender;
      dbData.genero = clientData.gender; // Portuguese field for compatibility
    }
    if (clientData.address !== undefined) {
      dbData.address = clientData.address;
      dbData.endereco = clientData.address; // Portuguese field for compatibility
    }
    if (clientData.city !== undefined) {
      dbData.city = clientData.city;
      dbData.cidade = clientData.city; // Portuguese field for compatibility
    }
    if (clientData.state !== undefined) {
      dbData.state = clientData.state;
      dbData.estado = clientData.state; // Portuguese field for compatibility
    }
    if (clientData.zip_code !== undefined) {
      dbData.zip_code = clientData.zip_code;
      dbData.cep = clientData.zip_code; // Portuguese field for compatibility
    }
    if (clientData.notes !== undefined) {
      dbData.notes = clientData.notes;
      dbData.notas = clientData.notes; // Portuguese field for compatibility
    }

    const { data, error } = await supabase
      .from('clients')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating client:', error);
      throw error;
    }

    console.log('Updated client:', data);

    // Map response back to Client interface
    const updatedClient: Client = {
      id: data.id,
      business_id: data.business_id,
      name: data.name,
      email: data.email || '',
      phone: data.phone || '',
      birth_date: data.birth_date || '',
      gender: data.gender || '',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      zip_code: data.zip_code || '',
      notes: data.notes || '',
      created_at: data.created_at,
      updated_at: data.updated_at,
      last_visit: data.last_visit,
      total_spent: data.total_spent || 0,
      status: data.status || 'active',
      preferences: typeof data.preferences === 'object' && data.preferences !== null 
        ? data.preferences as Record<string, any>
        : {}
    };

    // Update local state
    setClients(prev => prev.map(client => 
      client.id === id ? updatedClient : client
    ));

    return updatedClient;
  };

  const deleteClient = async (id: string): Promise<void> => {
    console.log('Deleting client:', id);

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting client:', error);
      throw error;
    }

    // Update local state
    setClients(prev => prev.filter(client => client.id !== id));
  };

  const refetch = () => {
    fetchClients();
  };

  useEffect(() => {
    fetchClients();
  }, [businessId]);

  return {
    clients,
    isLoading,
    error,
    createClient,
    updateClient,
    deleteClient,
    refetch
  };
};
