
/**
 * Raw API calls for client operations
 */
import { supabase } from '@/integrations/supabase/client';
import { Client, ClientFormData, ClientSearchParams } from '@/types/client';
import { handleError } from '@/utils/errorHandler';

/**
 * Fetch all clients for a business
 */
export async function fetchClientsApi(businessId: string) {
  if (!businessId) {
    console.log('No business ID available, skipping client fetch');
    return { data: null, error: new Error('Business ID is required') };
  }

  console.log('Fetching clients for business ID:', businessId);
  
  // Query using both field names to ensure compatibility
  return supabase
    .from('clientes')
    .select('*')
    .or(`id_negocio.eq.${businessId},tenant_id.eq.${businessId}`);
}

/**
 * Create a new client
 */
export async function createClientApi(clientData: Partial<Client>, businessId: string) {
  if (!businessId) {
    return { data: null, error: new Error('Business ID is required') };
  }
  
  try {
    console.log('Creating client for business ID:', businessId, clientData);
    
    // Include both tenant_id and id_negocio for compatibility
    const dataToInsert = {
      ...clientData,
      id_negocio: businessId,
      tenant_id: businessId // Ensuring both fields are set
    };

    return supabase
      .from('clientes')
      .insert([dataToInsert])
      .select()
      .single();
  } catch (error) {
    handleError('createClientApi', error);
    throw error;
  }
}

/**
 * Find a client by search parameters
 */
export async function findClientApi(params: ClientSearchParams, businessId: string) {
  if (!businessId) {
    return { data: null, error: new Error('Business ID is required') };
  }
  
  try {
    let query = supabase
      .from('clientes')
      .select('*')
      .or(`id_negocio.eq.${businessId},tenant_id.eq.${businessId}`);

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
  } catch (error) {
    handleError('findClientApi', error);
    throw error;
  }
}

/**
 * Update an existing client
 */
export async function updateClientApi(id: string, clientData: Partial<Client>, businessId: string) {
  if (!businessId || !id) {
    return { data: null, error: new Error('Business ID and client ID are required') };
  }
  
  try {
    // Ensure tenant_id is included if updating
    const dataToUpdate = { 
      ...clientData,
      // Only set these if they're not already set in the data
      tenant_id: clientData.tenant_id || businessId,
      id_negocio: clientData.id_negocio || businessId
    };

    return supabase
      .from('clientes')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single();
  } catch (error) {
    handleError('updateClientApi', error);
    throw error;
  }
}

/**
 * Delete a client
 */
export async function deleteClientApi(id: string, businessId: string) {
  if (!businessId || !id) {
    return { data: null, error: new Error('Business ID and client ID are required') };
  }
  
  try {
    return supabase
      .from('clientes')
      .delete()
      .eq('id', id);
  } catch (error) {
    handleError('deleteClientApi', error);
    throw error;
  }
}
