
import { supabase } from '@/integrations/supabase/client';
import { Client, ClientFormData, ClientSearchParams } from '@/types/client';

export const clientApi = {
  // Get all clients for a business with optional search and pagination
  async getClients(businessId: string, params: ClientSearchParams = {}) {
    try {
      let query = supabase
        .from('clients')
        .select('*')
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
        .select('*')
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
        id_negocio: businessId, // Also set the legacy field
        nome: clientData.name, // Set the legacy field
        name: clientData.name,
        email: clientData.email,
        telefone: clientData.phone, // Set the legacy field
        phone: clientData.phone,
        birth_date: clientData.birth_date,
        data_nascimento: clientData.birth_date, // Set the legacy field
        gender: clientData.gender,
        genero: clientData.gender, // Set the legacy field
        address: clientData.address,
        endereco: clientData.address, // Set the legacy field
        city: clientData.city,
        cidade: clientData.city, // Set the legacy field
        state: clientData.state,
        estado: clientData.state, // Set the legacy field
        zip_code: clientData.zip_code,
        cep: clientData.zip_code, // Set the legacy field
        notes: clientData.notes,
        notas: clientData.notes, // Set the legacy field
      };

      const { data, error } = await supabase
        .from('clients')
        .insert(insertData)
        .select()
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
        updateData.nome = clientData.name; // Also update legacy field
      }
      if (clientData.email !== undefined) {
        updateData.email = clientData.email;
      }
      if (clientData.phone !== undefined) {
        updateData.phone = clientData.phone;
        updateData.telefone = clientData.phone; // Also update legacy field
      }
      if (clientData.birth_date !== undefined) {
        updateData.birth_date = clientData.birth_date;
        updateData.data_nascimento = clientData.birth_date; // Also update legacy field
      }
      if (clientData.gender !== undefined) {
        updateData.gender = clientData.gender;
        updateData.genero = clientData.gender; // Also update legacy field
      }
      if (clientData.address !== undefined) {
        updateData.address = clientData.address;
        updateData.endereco = clientData.address; // Also update legacy field
      }
      if (clientData.city !== undefined) {
        updateData.city = clientData.city;
        updateData.cidade = clientData.city; // Also update legacy field
      }
      if (clientData.state !== undefined) {
        updateData.state = clientData.state;
        updateData.estado = clientData.state; // Also update legacy field
      }
      if (clientData.zip_code !== undefined) {
        updateData.zip_code = clientData.zip_code;
        updateData.cep = clientData.zip_code; // Also update legacy field
      }
      if (clientData.notes !== undefined) {
        updateData.notes = clientData.notes;
        updateData.notas = clientData.notes; // Also update legacy field
      }

      const { data, error } = await supabase
        .from('clients')
        .update(updateData)
        .eq('id', clientId)
        .select()
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
