
import { ClientService } from './clientService';
import type { Client, ClientFormData, ClientListResult, ClientOperationResult } from '@/types/client';

const clientService = ClientService.getInstance();

export async function getAllClients(): Promise<Client[]> {
  try {
    // This would need a business_id - using empty array for now
    return [];
  } catch (error) {
    console.error('Error fetching all clients:', error);
    throw error;
  }
}

export async function getClientsByBusiness(businessId: string, params: { page?: number; limit?: number } = {}): Promise<ClientListResult> {
  try {
    const clients = await clientService.search({
      business_id: businessId,
      page: params.page || 1,
      limit: params.limit || 10
    });

    return {
      clients,
      total: clients.length,
      page: params.page || 1,
    };
  } catch (error) {
    console.error('Error fetching clients by business:', error);
    throw error;
  }
}

export async function createClient(businessId: string, clientData: ClientFormData): Promise<ClientOperationResult> {
  try {
    const client = await clientService.create({
      business_id: businessId,
      ...clientData
    });

    return {
      success: true,
      data: client
    };
  } catch (error) {
    console.error('Error creating client:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function updateClient(id: string, clientData: Partial<ClientFormData>, businessId: string): Promise<ClientOperationResult> {
  try {
    const client = await clientService.update(id, clientData);

    return {
      success: true,
      data: client
    };
  } catch (error) {
    console.error('Error updating client:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function deleteClient(id: string): Promise<ClientOperationResult> {
  try {
    await clientService.delete(id);

    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting client:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function findClientByEmail(email: string, businessId: string): Promise<Client | null> {
  try {
    const clients = await clientService.search({
      business_id: businessId,
      search: email
    });
    return clients.find(client => client.email === email) || null;
  } catch (error) {
    console.error('Error finding client by email:', error);
    return null;
  }
}

export async function findClientByPhone(phone: string, businessId: string): Promise<Client | null> {
  try {
    const clients = await clientService.search({
      business_id: businessId,
      search: phone
    });
    return clients.find(client => client.phone === phone) || null;
  } catch (error) {
    console.error('Error finding client by phone:', error);
    return null;
  }
}
