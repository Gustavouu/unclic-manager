
/**
 * Raw API calls for client operations
 */
import { supabase } from '@/integrations/supabase/client';
import { Client, ClientFormData, ClientSearchParams } from '@/types/client';

/**
 * Fetch all clients for a business
 */
export async function fetchClientsApi(businessId: string) {
  if (!businessId) {
    console.log('No business ID available, skipping client fetch');
    return { data: null, error: new Error('Business ID is required') };
  }

  console.log('Fetching clients for business ID:', businessId);
  
  // Query using only id_negocio to ensure compatibility
  return supabase
    .from('clientes')
    .select('*')
    .eq('id_negocio', businessId);
}

/**
 * Create a new client
 */
export async function createClientApi(clientData: Partial<Client>, businessId: string) {
  if (!businessId) {
    return { data: null, error: new Error('Business ID is required') };
  }
  
  console.log('Creating client for business ID:', businessId, clientData);
  
  // Only use id_negocio field which exists in the database
  const dataToInsert = {
    ...clientData,
    id_negocio: businessId
  };

  return supabase
    .from('clientes')
    .insert([dataToInsert])
    .select()
    .single();
}

/**
 * Find a client by search parameters
 */
export async function findClientApi(params: ClientSearchParams, businessId: string) {
  if (!businessId) {
    return { data: null, error: new Error('Business ID is required') };
  }
  
  let query = supabase
    .from('clientes')
    .select('*')
    .eq('id_negocio', businessId);

  // Add filters based on provided params
  if (params.email) {
    query = query.eq('email', params.email);
  }
  
  if (params.telefone) {
    query = query.eq('telefone', params.telefone);
  }
  
  if (params.nome) {
    query = query.ilike('nome', `%${params.nome}%`);
  }

  return query.maybeSingle();
}

/**
 * Update an existing client
 */
export async function updateClientApi(id: string, clientData: Partial<Client>, businessId: string) {
  if (!businessId || !id) {
    return { data: null, error: new Error('Business ID and client ID are required') };
  }
  
  return supabase
    .from('clientes')
    .update(clientData)
    .eq('id', id)
    .select()
    .single();
}

/**
 * Delete a client
 */
export async function deleteClientApi(id: string, businessId: string) {
  if (!businessId || !id) {
    return { data: null, error: new Error('Business ID and client ID are required') };
  }
  
  return supabase
    .from('clientes')
    .delete()
    .eq('id', id);
}
