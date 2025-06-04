
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
      
      // Query the clients table with proper field mapping
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id_negocio', businessId)
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }

      console.log('Raw clients data:', data);

      // Map the database fields to the expected Client interface
      const mappedClients: Client[] = (data || []).map(client => ({
        id: client.id,
        business_id: client.business_id || client.id_negocio,
        name: client.nome || client.name || '',
        email: client.email || '',
        phone: client.telefone || client.phone || '',
        birth_date: client.data_nascimento || client.birth_date || '',
        gender: client.genero || client.gender || '',
        address: client.endereco || client.address || '',
        city: client.cidade || client.city || '',
        state: client.estado || client.state || '',
        zip_code: client.cep || client.zip_code || '',
        notes: client.notas || client.notes || '',
        created_at: client.criado_em || client.created_at,
        updated_at: client.atualizado_em || client.updated_at,
        last_visit: client.ultima_visita || client.last_visit,
        total_spent: client.valor_total_gasto || client.total_spent || 0,
        status: client.status || 'active',
        preferences: client.preferencias || {}
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

    // Map form data to database schema
    const dbData = {
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
      status: 'active',
      valor_total_gasto: 0,
      preferencias: {}
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
      business_id: data.id_negocio,
      name: data.nome,
      email: data.email || '',
      phone: data.telefone || '',
      birth_date: data.data_nascimento || '',
      gender: data.genero || '',
      address: data.endereco || '',
      city: data.cidade || '',
      state: data.estado || '',
      zip_code: data.cep || '',
      notes: data.notas || '',
      created_at: data.criado_em,
      updated_at: data.atualizado_em,
      last_visit: data.ultima_visita,
      total_spent: data.valor_total_gasto || 0,
      status: data.status || 'active',
      preferences: data.preferencias || {}
    };

    // Update local state
    setClients(prev => [newClient, ...prev]);
    return newClient;
  };

  const updateClient = async (id: string, clientData: Partial<ClientFormData>): Promise<Client> => {
    console.log('Updating client:', id, clientData);

    // Map form data to database schema
    const dbData: any = {};
    if (clientData.name !== undefined) dbData.nome = clientData.name;
    if (clientData.email !== undefined) dbData.email = clientData.email;
    if (clientData.phone !== undefined) dbData.telefone = clientData.phone;
    if (clientData.birth_date !== undefined) dbData.data_nascimento = clientData.birth_date;
    if (clientData.gender !== undefined) dbData.genero = clientData.gender;
    if (clientData.address !== undefined) dbData.endereco = clientData.address;
    if (clientData.city !== undefined) dbData.cidade = clientData.city;
    if (clientData.state !== undefined) dbData.estado = clientData.state;
    if (clientData.zip_code !== undefined) dbData.cep = clientData.zip_code;
    if (clientData.notes !== undefined) dbData.notas = clientData.notes;

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
      business_id: data.id_negocio,
      name: data.nome,
      email: data.email || '',
      phone: data.telefone || '',
      birth_date: data.data_nascimento || '',
      gender: data.genero || '',
      address: data.endereco || '',
      city: data.cidade || '',
      state: data.estado || '',
      zip_code: data.cep || '',
      notes: data.notas || '',
      created_at: data.criado_em,
      updated_at: data.atualizado_em,
      last_visit: data.ultima_visita,
      total_spent: data.valor_total_gasto || 0,
      status: data.status || 'active',
      preferences: data.preferencias || {}
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
