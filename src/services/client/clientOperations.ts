
import { clientApi } from './clientApi';
import { Client, ClientFormData, ClientListResult, ClientOperationResult } from '@/types/client';

export const clientOperations = {
  // List clients with error handling
  async listClients(businessId: string, params = {}): Promise<ClientListResult> {
    try {
      const result = await clientApi.getClients(businessId, params);
      return {
        success: true,
        ...result
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch clients'
      };
    }
  },

  // Create client with error handling
  async createClient(businessId: string, clientData: ClientFormData): Promise<ClientOperationResult> {
    try {
      const client = await clientApi.createClient(businessId, clientData);
      return {
        success: true,
        data: client
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create client'
      };
    }
  },

  // Update client with error handling
  async updateClient(clientId: string, clientData: Partial<ClientFormData>, businessId: string): Promise<ClientOperationResult> {
    try {
      const client = await clientApi.updateClient(clientId, clientData);
      return {
        success: true,
        data: client
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update client'
      };
    }
  },

  // Get client with error handling
  async getClient(clientId: string): Promise<ClientOperationResult> {
    try {
      const client = await clientApi.getClientById(clientId);
      return {
        success: true,
        data: client
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch client'
      };
    }
  },

  // Delete client with error handling
  async deleteClient(clientId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await clientApi.deleteClient(clientId);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete client'
      };
    }
  }
};

// Export individual functions for backwards compatibility
export const createClient = clientOperations.createClient;
export const updateClient = clientOperations.updateClient;
export const deleteClient = clientOperations.deleteClient;
export const findClientByEmail = async (email: string, businessId: string): Promise<Client | null> => {
  try {
    const result = await clientApi.getClients(businessId, { search: email });
    return result.data?.find(client => client.email === email) || null;
  } catch (error) {
    console.error('Error finding client by email:', error);
    return null;
  }
};
export const findClientByPhone = async (phone: string, businessId: string): Promise<Client | null> => {
  try {
    const result = await clientApi.getClients(businessId, { search: phone });
    return result.data?.find(client => client.phone === phone) || null;
  } catch (error) {
    console.error('Error finding client by phone:', error);
    return null;
  }
};
