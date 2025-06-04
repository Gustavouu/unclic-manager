
import { supabase } from '@/integrations/supabase/client';
import { normalizeClientData } from '@/utils/databaseUtils';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  birth_date?: string;
  last_visit?: string;
  total_spent?: number;
  total_appointments?: number;
  city?: string;
  state?: string;
  zip_code?: string;
  avatar?: string;
  status: string;
  address?: string;
  gender?: string;
  notes?: string;
  created_at?: string;
  business_id: string;
  user_id?: string;
}

export const fetchClients = async (businessId: string): Promise<Client[]> => {
  try {
    // Try unified table first
    const { data: unifiedClients, error: unifiedError } = await supabase
      .from('clients_unified')
      .select('*')
      .eq('business_id', businessId);

    if (!unifiedError && unifiedClients) {
      return unifiedClients.map(normalizeClientData);
    }

    console.warn('Unified clients table not accessible, trying fallback:', unifiedError);

    // Fallback to original clients table
    const { data: fallbackClients, error: fallbackError } = await supabase
      .from('clients')
      .select('*')
      .eq('id_negocio', businessId);

    if (fallbackError) {
      console.error('Error fetching clients from fallback table:', fallbackError);
      throw fallbackError;
    }

    return (fallbackClients || []).map(normalizeClientData);
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

export const createClient = async (clientData: Partial<Client>): Promise<Client> => {
  try {
    // Try to insert into unified table first
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
      return normalizeClientData(unifiedClient);
    }

    console.warn('Could not insert into unified table, trying fallback:', unifiedError);

    // Fallback to original clients table
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

    return normalizeClientData(fallbackClient);
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

export const findClientByEmail = async (email: string, businessId: string): Promise<Client | null> => {
  try {
    // Try unified table first
    const { data: unifiedClient, error: unifiedError } = await supabase
      .from('clients_unified')
      .select('*')
      .eq('email', email)
      .eq('business_id', businessId)
      .single();

    if (!unifiedError && unifiedClient) {
      return normalizeClientData(unifiedClient);
    }

    // Fallback to original table
    const { data: fallbackClient, error: fallbackError } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .eq('id_negocio', businessId)
      .single();

    if (fallbackError && fallbackError.code !== 'PGRST116') {
      console.error('Error finding client by email:', fallbackError);
      return null;
    }

    return fallbackClient ? normalizeClientData(fallbackClient) : null;
  } catch (error) {
    console.error('Error finding client by email:', error);
    return null;
  }
};

export const findClientByPhone = async (phone: string, businessId: string): Promise<Client | null> => {
  try {
    // Try unified table first
    const { data: unifiedClient, error: unifiedError } = await supabase
      .from('clients_unified')
      .select('*')
      .eq('phone', phone)
      .eq('business_id', businessId)
      .single();

    if (!unifiedError && unifiedClient) {
      return normalizeClientData(unifiedClient);
    }

    // Fallback to original table
    const { data: fallbackClient, error: fallbackError } = await supabase
      .from('clients')
      .select('*')
      .eq('telefone', phone)
      .eq('id_negocio', businessId)
      .single();

    if (fallbackError && fallbackError.code !== 'PGRST116') {
      console.error('Error finding client by phone:', fallbackError);
      return null;
    }

    return fallbackClient ? normalizeClientData(fallbackClient) : null;
  } catch (error) {
    console.error('Error finding client by phone:', error);
    return null;
  }
};
