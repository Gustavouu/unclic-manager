
import { supabase } from '@/integrations/supabase/client';
import { Client, ClientFormData, ClientSearchParams } from '@/types/client';

export const clientApi = {
  // Get all clients for a business with optional search and pagination
  async getClients(businessId: string, params: ClientSearchParams = {}) {
    try {
      let query = supabase
        .from('clients')
        .select('id, name, email, phone, birth_date, gender, address, city, state, zip_code, notes, created_at, updated_at, business_id, user_id, last_visit, total_spent')
        .eq('business_id', businessId);

      // Apply search filter
      if (params.search) {
        query = query.or(`name.ilike.%${params.search}%,email.ilike.%${params.search}%,phone.ilike.%${params.search}%`);
      }

      // Apply city filter
      if (params.city) {
        query = query.eq('city', params.city);
      }

      // Apply state filter
      if (params.state) {
        query = query.eq('state', params.state);
      }

      // Apply status filter
      if (params.status) {
        query = query.eq('status', params.status);
      }

      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 10;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await query
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { 
        data: data as Client[], 
        count: count || 0,
        page,
        limit
      };
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  // Get client by ID
  async getClientById(clientId: string) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, email, phone, birth_date, gender, address, city, state, zip_code, notes, created_at, updated_at, business_id, user_id, last_visit, total_spent')
        .eq('id', clientId)
        .single();

      if (error) throw error;
      return data as Client;
    } catch (error) {
      console.error('Error fetching client:', error);
      throw error;
    }
  },

  // Create new client
  async createClient(businessId: string, clientData: ClientFormData) {
    try {
      const insertData = {
        business_id: businessId,
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
      };

      const { data, error } = await supabase
        .from('clients')
        .insert(insertData)
        .select('id, name, email, phone, birth_date, gender, address, city, state, zip_code, notes, created_at, updated_at, business_id, user_id, last_visit, total_spent')
        .single();

      if (error) throw error;
      return data as Client;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  // Update client
  async updateClient(clientId: string, clientData: Partial<ClientFormData>) {
    try {
      const updateData: any = {};
      
      if (clientData.name !== undefined) {
        updateData.name = clientData.name;
      }
      if (clientData.email !== undefined) {
        updateData.email = clientData.email;
      }
      if (clientData.phone !== undefined) {
        updateData.phone = clientData.phone;
      }
      if (clientData.birth_date !== undefined) {
        updateData.birth_date = clientData.birth_date;
      }
      if (clientData.gender !== undefined) {
        updateData.gender = clientData.gender;
      }
      if (clientData.address !== undefined) {
        updateData.address = clientData.address;
      }
      if (clientData.city !== undefined) {
        updateData.city = clientData.city;
      }
      if (clientData.state !== undefined) {
        updateData.state = clientData.state;
      }
      if (clientData.zip_code !== undefined) {
        updateData.zip_code = clientData.zip_code;
      }
      if (clientData.notes !== undefined) {
        updateData.notes = clientData.notes;
      }

      const { data, error } = await supabase
        .from('clients')
        .update(updateData)
        .eq('id', clientId)
        .select('id, name, email, phone, birth_date, gender, address, city, state, zip_code, notes, created_at, updated_at, business_id, user_id, last_visit, total_spent')
        .single();

      if (error) throw error;
      return data as Client;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  },

  // Delete client
  async deleteClient(clientId: string) {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }
};

// Export individual functions for backwards compatibility
export const fetchClientsApi = clientApi.getClients;
export const createClientApi = clientApi.createClient;
export const findClientApi = clientApi.getClientById;
export const updateClientApi = clientApi.updateClient;
export const deleteClientApi = clientApi.deleteClient;
