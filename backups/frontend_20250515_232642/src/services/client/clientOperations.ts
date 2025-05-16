
/**
 * Business operations for clients
 */
import { toast } from 'sonner';
import { Client, ClientFormData, ClientOperationResult, ClientListResult, ClientSearchParams } from '@/types/client';
import { 
  fetchClientsApi, 
  createClientApi, 
  findClientApi,
  updateClientApi,
  deleteClientApi
} from './clientApi';
import { mapClientFromDatabase } from './clientUtils';

/**
 * Fetch all clients for a business
 */
export async function fetchClients(businessId: string): Promise<ClientListResult> {
  try {
    const { data, error } = await fetchClientsApi(businessId);
    
    if (error) {
      console.error("Erro ao buscar clientes:", error);
      return { success: false, error: error.message };
    }
    
    // Map the database columns to our client interface
    const mappedClients = (data || []).map(mapClientFromDatabase);
    
    return { success: true, data: mappedClients };
  } catch (err: any) {
    console.error("Erro inesperado ao buscar clientes:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Create a new client
 */
export async function createClient(clientData: ClientFormData, businessId: string): Promise<ClientOperationResult> {
  try {
    const { data, error } = await createClientApi(clientData, businessId);
    
    if (error) {
      console.error("Error creating client:", error);
      return { success: false, error: error.message };
    }
    
    // Map database response to client interface
    const newClient = mapClientFromDatabase(data);
    
    return { success: true, data: newClient };
  } catch (err: any) {
    console.error("Error creating client:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Find a client by email
 */
export async function findClientByEmail(email: string, businessId: string): Promise<Client | null> {
  try {
    const { data, error } = await findClientApi({ email }, businessId);
    
    if (error) throw error;
    if (!data) return null;
    
    return mapClientFromDatabase(data);
  } catch (err: any) {
    console.error("Error finding client by email:", err);
    return null;
  }
}

/**
 * Find a client by phone
 */
export async function findClientByPhone(phone: string, businessId: string): Promise<Client | null> {
  try {
    const { data, error } = await findClientApi({ telefone: phone }, businessId);
    
    if (error) throw error;
    if (!data) return null;
    
    return mapClientFromDatabase(data);
  } catch (err: any) {
    console.error("Error finding client by phone:", err);
    return null;
  }
}

/**
 * Update an existing client
 */
export async function updateClient(id: string, clientData: Partial<ClientFormData>, businessId: string): Promise<ClientOperationResult> {
  try {
    const { data, error } = await updateClientApi(id, clientData, businessId);
    
    if (error) {
      console.error("Error updating client:", error);
      return { success: false, error: error.message };
    }
    
    const updatedClient = mapClientFromDatabase(data);
    
    return { success: true, data: updatedClient };
  } catch (err: any) {
    console.error("Error updating client:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Delete a client
 */
export async function deleteClient(id: string, businessId: string): Promise<ClientOperationResult> {
  try {
    const { error } = await deleteClientApi(id, businessId);
    
    if (error) {
      console.error("Error deleting client:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err: any) {
    console.error("Error deleting client:", err);
    return { success: false, error: err.message };
  }
}
