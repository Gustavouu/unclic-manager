
import { supabase } from '@/integrations/supabase/client';
import { Client, ClientFormData, ClientSearchParams } from '@/types/client';

export const clientApi = {
  // Get all clients for a business with optional search and pagination
  async getClients(businessId: string, params: ClientSearchParams = {}) {
    try {
      let query = supabase
        .from('clients')
        .select('id, name, email, phone, birth_date, gender, address, city, state, zip_code, notes, created_at, updated_at, business_id, user_id, last_visit, total_spent, nome, telefone, endereco, cidade, estado, cep, notas, criado_em, atualizado_em, id_negocio, id_usuario, data_nascimento, ultima_visita, valor_total_gasto')
        .or(`business_id.eq.${businessId},id_negocio.eq.${businessId}`);

      // Apply search filter
      if (params.search) {
        query = query.or(`name.ilike.%${params.search}%,email.ilike.%${params.search}%,phone.ilike.%${params.search}%,nome.ilike.%${params.search}%,telefone.ilike.%${params.search}%`);
      }

      // Apply city filter
      if (params.city) {
        query = query.or(`city.eq.${params.city},cidade.eq.${params.city}`);
      }

      // Apply state filter
      if (params.state) {
        query = query.or(`state.eq.${params.state},estado.eq.${params.state}`);
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

      // Map Portuguese fields to English fields
      const mappedData = data?.map((client: any) => ({
        id: client.id,
        name: client.name || client.nome,
        email: client.email,
        phone: client.phone || client.telefone,
        birth_date: client.birth_date || client.data_nascimento,
        gender: client.gender || client.genero,
        address: client.address || client.endereco,
        city: client.city || client.cidade,
        state: client.state || client.estado,
        zip_code: client.zip_code || client.cep,
        notes: client.notes || client.notas,
        created_at: client.created_at || client.criado_em,
        updated_at: client.updated_at || client.atualizado_em,
        business_id: client.business_id || client.id_negocio,
        user_id: client.user_id || client.id_usuario,
        last_visit: client.last_visit || client.ultima_visita,
        total_spent: client.total_spent || client.valor_total_gasto || 0,
      })) as Client[];

      return { 
        data: mappedData || [], 
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
      
      // Map Portuguese fields to English fields
      return {
        id: data.id,
        name: data.name || data.nome,
        email: data.email,
        phone: data.phone || data.telefone,
        birth_date: data.birth_date || data.data_nascimento,
        gender: data.gender || data.genero,
        address: data.address || data.endereco,
        city: data.city || data.cidade,
        state: data.state || data.estado,
        zip_code: data.zip_code || data.cep,
        notes: data.notes || data.notas,
        created_at: data.created_at || data.criado_em,
        updated_at: data.updated_at || data.atualizado_em,
        business_id: data.business_id || data.id_negocio,
        user_id: data.user_id || data.id_usuario,
        last_visit: data.last_visit || data.ultima_visita,
        total_spent: data.total_spent || data.valor_total_gasto || 0,
      } as Client;
    } catch (error) {
      console.error('Error fetching client:', error);
      throw error;
    }
  },

  // Create new client
  async createClient(businessId: string, clientData: ClientFormData) {
    try {
      const insertData = {
        // Use both English and Portuguese field names for compatibility
        business_id: businessId,
        id_negocio: businessId,
        name: clientData.name,
        nome: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        telefone: clientData.phone,
        birth_date: clientData.birth_date,
        data_nascimento: clientData.birth_date,
        gender: clientData.gender,
        genero: clientData.gender,
        address: clientData.address,
        endereco: clientData.address,
        city: clientData.city,
        cidade: clientData.city,
        state: clientData.state,
        estado: clientData.state,
        zip_code: clientData.zip_code,
        cep: clientData.zip_code,
        notes: clientData.notes,
        notas: clientData.notes,
      };

      const { data, error } = await supabase
        .from('clients')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name || data.nome,
        email: data.email,
        phone: data.phone || data.telefone,
        birth_date: data.birth_date || data.data_nascimento,
        gender: data.gender || data.genero,
        address: data.address || data.endereco,
        city: data.city || data.cidade,
        state: data.state || data.estado,
        zip_code: data.zip_code || data.cep,
        notes: data.notes || data.notas,
        created_at: data.created_at || data.criado_em,
        updated_at: data.updated_at || data.atualizado_em,
        business_id: data.business_id || data.id_negocio,
        user_id: data.user_id || data.id_usuario,
        last_visit: data.last_visit || data.ultima_visita,
        total_spent: data.total_spent || data.valor_total_gasto || 0,
      } as Client;
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
        updateData.nome = clientData.name;
      }
      if (clientData.email !== undefined) {
        updateData.email = clientData.email;
      }
      if (clientData.phone !== undefined) {
        updateData.phone = clientData.phone;
        updateData.telefone = clientData.phone;
      }
      if (clientData.birth_date !== undefined) {
        updateData.birth_date = clientData.birth_date;
        updateData.data_nascimento = clientData.birth_date;
      }
      if (clientData.gender !== undefined) {
        updateData.gender = clientData.gender;
        updateData.genero = clientData.gender;
      }
      if (clientData.address !== undefined) {
        updateData.address = clientData.address;
        updateData.endereco = clientData.address;
      }
      if (clientData.city !== undefined) {
        updateData.city = clientData.city;
        updateData.cidade = clientData.city;
      }
      if (clientData.state !== undefined) {
        updateData.state = clientData.state;
        updateData.estado = clientData.state;
      }
      if (clientData.zip_code !== undefined) {
        updateData.zip_code = clientData.zip_code;
        updateData.cep = clientData.zip_code;
      }
      if (clientData.notes !== undefined) {
        updateData.notes = clientData.notes;
        updateData.notas = clientData.notes;
      }

      const { data, error } = await supabase
        .from('clients')
        .update(updateData)
        .eq('id', clientId)
        .select()
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name || data.nome,
        email: data.email,
        phone: data.phone || data.telefone,
        birth_date: data.birth_date || data.data_nascimento,
        gender: data.gender || data.genero,
        address: data.address || data.endereco,
        city: data.city || data.cidade,
        state: data.state || data.estado,
        zip_code: data.zip_code || data.cep,
        notes: data.notes || data.notas,
        created_at: data.created_at || data.criado_em,
        updated_at: data.updated_at || data.atualizado_em,
        business_id: data.business_id || data.id_negocio,
        user_id: data.user_id || data.id_usuario,
        last_visit: data.last_visit || data.ultima_visita,
        total_spent: data.total_spent || data.valor_total_gasto || 0,
      } as Client;
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
