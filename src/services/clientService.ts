
import { supabase } from '@/integrations/supabase/client';
import { normalizeClientData } from '@/utils/databaseUtils';
import type { Client } from '@/types/client';

export const fetchClients = async (businessId: string): Promise<Client[]> => {
  try {
    console.log('Fetching clients for business:', businessId);
    
    // Primary: Try unified table first
    const { data: unifiedClients, error: unifiedError } = await supabase
      .from('clients_unified')
      .select('*')
      .eq('business_id', businessId);

    if (!unifiedError && unifiedClients) {
      console.log('Successfully fetched from clients_unified:', unifiedClients.length, 'clients');
      return unifiedClients.map(normalizeClientData);
    }

    console.warn('Unified clients table not accessible, trying fallback:', unifiedError);

    // Fallback: Try original clients table
    const { data: fallbackClients, error: fallbackError } = await supabase
      .from('clients')
      .select('*')
      .eq('id_negocio', businessId);

    if (fallbackError) {
      console.error('Error fetching clients from fallback table:', fallbackError);
      throw fallbackError;
    }

    console.log('Successfully fetched from clients fallback:', fallbackClients?.length || 0, 'clients');
    return (fallbackClients || []).map(normalizeClientData);
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

export const createClient = async (clientData: Partial<Client>): Promise<Client> => {
  try {
    console.log('Creating client with data:', clientData);

    // Primary: Try to insert into unified table first
    const { data: unifiedClient, error: unifiedError } = await supabase
      .from('clients_unified')
      .insert([{
        business_id: clientData.business_id,
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        birth_date: clientData.birth_date,
        gender: clientData.gender,
        address: clientData.address,
        city: clientData.city,
        state: clientData.state,
        zip_code: clientData.zip_code,
        notes: clientData.notes,
        status: clientData.status || 'active'
      }])
      .select()
      .single();

    if (!unifiedError && unifiedClient) {
      console.log('Successfully created client in clients_unified');
      return normalizeClientData(unifiedClient);
    }

    console.warn('Could not insert into unified table, trying fallback:', unifiedError);

    // Fallback: Try original clients table
    const { data: fallbackClient, error: fallbackError } = await supabase
      .from('clients')
      .insert([{
        id_negocio: clientData.business_id,
        nome: clientData.name,
        email: clientData.email,
        telefone: clientData.phone,
        data_nascimento: clientData.birth_date,
        genero: clientData.gender,
        endereco: clientData.address,
        cidade: clientData.city,
        estado: clientData.state,
        cep: clientData.zip_code,
        notas: clientData.notes,
        status: clientData.status || 'active'
      }])
      .select()
      .single();

    if (fallbackError) {
      console.error('Error creating client in fallback table:', fallbackError);
      throw fallbackError;
    }

    console.log('Successfully created client in clients fallback');
    return normalizeClientData(fallbackClient);
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

export const updateClient = async (id: string, clientData: Partial<Client>): Promise<Client> => {
  try {
    console.log('Updating client:', id, 'with data:', clientData);

    // Primary: Try unified table first
    const { data: unifiedClient, error: unifiedError } = await supabase
      .from('clients_unified')
      .update({
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        birth_date: clientData.birth_date,
        gender: clientData.gender,
        address: clientData.address,
        city: clientData.city,
        state: clientData.state,
        zip_code: clientData.zip_code,
        notes: clientData.notes,
        status: clientData.status
      })
      .eq('id', id)
      .select()
      .single();

    if (!unifiedError && unifiedClient) {
      console.log('Successfully updated client in clients_unified');
      return normalizeClientData(unifiedClient);
    }

    console.warn('Could not update in unified table, trying fallback:', unifiedError);

    // Fallback: Try original clients table
    const { data: fallbackClient, error: fallbackError } = await supabase
      .from('clients')
      .update({
        nome: clientData.name,
        email: clientData.email,
        telefone: clientData.phone,
        data_nascimento: clientData.birth_date,
        genero: clientData.gender,
        endereco: clientData.address,
        cidade: clientData.city,
        estado: clientData.state,
        cep: clientData.zip_code,
        notas: clientData.notes,
        status: clientData.status
      })
      .eq('id', id)
      .select()
      .single();

    if (fallbackError) {
      console.error('Error updating client in fallback table:', fallbackError);
      throw fallbackError;
    }

    console.log('Successfully updated client in clients fallback');
    return normalizeClientData(fallbackClient);
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
};

export const deleteClient = async (id: string): Promise<void> => {
  try {
    console.log('Deleting client:', id);

    // Primary: Try unified table first
    const { error: unifiedError } = await supabase
      .from('clients_unified')
      .delete()
      .eq('id', id);

    if (!unifiedError) {
      console.log('Successfully deleted client from clients_unified');
      return;
    }

    console.warn('Could not delete from unified table, trying fallback:', unifiedError);

    // Fallback: Try original clients table
    const { error: fallbackError } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (fallbackError) {
      console.error('Error deleting client from fallback table:', fallbackError);
      throw fallbackError;
    }

    console.log('Successfully deleted client from clients fallback');
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};

export const searchClients = async (params: { search?: string; business_id?: string; limit?: number; offset?: number }): Promise<Client[]> => {
  try {
    if (!params.business_id) {
      return [];
    }

    console.log('Searching clients with params:', params);

    // Primary: Try unified table first
    let query = supabase
      .from('clients_unified')
      .select('*')
      .eq('business_id', params.business_id);

    if (params.search) {
      query = query.or(`name.ilike.%${params.search}%,email.ilike.%${params.search}%,phone.ilike.%${params.search}%`);
    }

    if (params.limit) {
      query = query.limit(params.limit);
    }

    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    }

    const { data: unifiedClients, error: unifiedError } = await query;

    if (!unifiedError && unifiedClients) {
      console.log('Successfully searched clients_unified:', unifiedClients.length, 'results');
      return unifiedClients.map(normalizeClientData);
    }

    console.warn('Could not search unified table, trying fallback:', unifiedError);

    // Fallback: Try original clients table
    let fallbackQuery = supabase
      .from('clients')
      .select('*')
      .eq('id_negocio', params.business_id);

    if (params.search) {
      fallbackQuery = fallbackQuery.or(`nome.ilike.%${params.search}%,email.ilike.%${params.search}%,telefone.ilike.%${params.search}%`);
    }

    if (params.limit) {
      fallbackQuery = fallbackQuery.limit(params.limit);
    }

    if (params.offset) {
      fallbackQuery = fallbackQuery.range(params.offset, params.offset + (params.limit || 10) - 1);
    }

    const { data: fallbackClients, error: fallbackError } = await fallbackQuery;

    if (fallbackError) {
      console.error('Error searching clients:', fallbackError);
      throw fallbackError;
    }

    console.log('Successfully searched clients fallback:', fallbackClients?.length || 0, 'results');
    return (fallbackClients || []).map(normalizeClientData);
  } catch (error) {
    console.error('Error searching clients:', error);
    return [];
  }
};

export const getClientById = async (id: string): Promise<Client | null> => {
  try {
    console.log('Getting client by ID:', id);

    // Primary: Try unified table first
    const { data: unifiedClient, error: unifiedError } = await supabase
      .from('clients_unified')
      .select('*')
      .eq('id', id)
      .single();

    if (!unifiedError && unifiedClient) {
      console.log('Successfully found client in clients_unified');
      return normalizeClientData(unifiedClient);
    }

    if (unifiedError && unifiedError.code !== 'PGRST116') {
      console.warn('Error in unified table (non-404):', unifiedError);
    }

    // Fallback: Try original table
    const { data: fallbackClient, error: fallbackError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (fallbackError && fallbackError.code !== 'PGRST116') {
      console.error('Error getting client by ID from fallback:', fallbackError);
      return null;
    }

    if (fallbackClient) {
      console.log('Successfully found client in clients fallback');
      return normalizeClientData(fallbackClient);
    }

    console.log('Client not found in any table');
    return null;
  } catch (error) {
    console.error('Error getting client by ID:', error);
    return null;
  }
};

export const findClientByEmail = async (email: string, businessId: string): Promise<Client | null> => {
  try {
    console.log('Finding client by email:', email, 'for business:', businessId);

    // Primary: Try unified table first
    const { data: unifiedClient, error: unifiedError } = await supabase
      .from('clients_unified')
      .select('*')
      .eq('email', email)
      .eq('business_id', businessId)
      .single();

    if (!unifiedError && unifiedClient) {
      console.log('Successfully found client by email in clients_unified');
      return normalizeClientData(unifiedClient);
    }

    if (unifiedError && unifiedError.code !== 'PGRST116') {
      console.warn('Error in unified table (non-404):', unifiedError);
    }

    // Fallback: Try original table
    const { data: fallbackClient, error: fallbackError } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .eq('id_negocio', businessId)
      .single();

    if (fallbackError && fallbackError.code !== 'PGRST116') {
      console.error('Error finding client by email from fallback:', fallbackError);
      return null;
    }

    if (fallbackClient) {
      console.log('Successfully found client by email in clients fallback');
      return normalizeClientData(fallbackClient);
    }

    console.log('Client not found by email in any table');
    return null;
  } catch (error) {
    console.error('Error finding client by email:', error);
    return null;
  }
};

export const findClientByPhone = async (phone: string, businessId: string): Promise<Client | null> => {
  try {
    console.log('Finding client by phone:', phone, 'for business:', businessId);

    // Primary: Try unified table first
    const { data: unifiedClient, error: unifiedError } = await supabase
      .from('clients_unified')
      .select('*')
      .eq('phone', phone)
      .eq('business_id', businessId)
      .single();

    if (!unifiedError && unifiedClient) {
      console.log('Successfully found client by phone in clients_unified');
      return normalizeClientData(unifiedClient);
    }

    if (unifiedError && unifiedError.code !== 'PGRST116') {
      console.warn('Error in unified table (non-404):', unifiedError);
    }

    // Fallback: Try original table
    const { data: fallbackClient, error: fallbackError } = await supabase
      .from('clients')
      .select('*')
      .eq('telefone', phone)
      .eq('id_negocio', businessId)
      .single();

    if (fallbackError && fallbackError.code !== 'PGRST116') {
      console.error('Error finding client by phone from fallback:', fallbackError);
      return null;
    }

    if (fallbackClient) {
      console.log('Successfully found client by phone in clients fallback');
      return normalizeClientData(fallbackClient);
    }

    console.log('Client not found by phone in any table');
    return null;
  } catch (error) {
    console.error('Error finding client by phone:', error);
    return null;
  }
};
