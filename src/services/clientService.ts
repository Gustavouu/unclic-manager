
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Client, ClientFormData, ClientSearchParams } from '@/types/client';

/**
 * Helper function to safely convert preferences to Record<string, any>
 */
function convertPreferences(preferences: any): Record<string, any> {
  if (preferences === null || preferences === undefined) {
    return {};
  }
  
  if (typeof preferences === 'object' && !Array.isArray(preferences)) {
    return preferences as Record<string, any>;
  }
  
  return {};
}

/**
 * Maps database client data to the Client interface
 */
function mapDbClientToClient(dbClient: any): Client {
  return {
    id: dbClient.id,
    business_id: dbClient.business_id || dbClient.id_negocio,
    name: dbClient.name || dbClient.nome,
    email: dbClient.email || '',
    phone: dbClient.phone || dbClient.telefone || '',
    birth_date: dbClient.birth_date || dbClient.data_nascimento || '',
    gender: dbClient.gender || dbClient.genero || '',
    address: dbClient.address || dbClient.endereco || '',
    city: dbClient.city || dbClient.cidade || '',
    state: dbClient.state || dbClient.estado || '',
    zip_code: dbClient.zip_code || dbClient.cep || '',
    notes: dbClient.notes || dbClient.notas || '',
    preferences: convertPreferences(dbClient.preferencias),
    last_visit: dbClient.last_visit || dbClient.ultima_visita,
    total_spent: Number(dbClient.total_spent || dbClient.valor_total_gasto) || 0,
    total_appointments: 0,
    status: dbClient.status || 'active',
    created_at: dbClient.created_at || dbClient.criado_em,
    updated_at: dbClient.updated_at || dbClient.atualizado_em,
  };
}

/**
 * Fetch all clients for a business
 */
export async function fetchClients(businessId: string): Promise<Client[]> {
  if (!businessId) {
    console.log('No business ID available, skipping client fetch');
    return [];
  }

  try {
    console.log('Fetching clients for business ID:', businessId);
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('business_id', businessId);

    if (error) {
      console.error("Erro ao buscar clientes:", error);
      toast.error("Não foi possível carregar os clientes.");
      throw error;
    }

    return (data || []).map(mapDbClientToClient);
  } catch (err: any) {
    console.error("Erro inesperado ao buscar clientes:", err);
    throw err;
  }
}

/**
 * Search clients with parameters
 */
export async function searchClients(params: ClientSearchParams): Promise<Client[]> {
  try {
    let query = supabase
      .from('clients')
      .select('*');

    if (params.business_id) {
      query = query.eq('business_id', params.business_id);
    }

    if (params.search) {
      query = query.or(`name.ilike.%${params.search}%,email.ilike.%${params.search}%,phone.ilike.%${params.search}%`);
    }

    if (params.city) {
      query = query.eq('city', params.city);
    }

    if (params.state) {
      query = query.eq('state', params.state);
    }

    if (params.status) {
      query = query.eq('status', params.status);
    }

    // Handle pagination
    if (params.page && params.limit) {
      const from = (params.page - 1) * params.limit;
      const to = from + params.limit - 1;
      query = query.range(from, to);
    }

    const { data, error } = await query.order('name');

    if (error) throw error;

    return (data || []).map(mapDbClientToClient);
  } catch (error) {
    console.error('Error searching clients:', error);
    throw error;
  }
}

/**
 * Create a new client
 */
export async function createClient(clientData: Partial<Client>, businessId: string): Promise<Client> {
  try {
    if (!businessId) {
      throw new Error("ID do negócio não disponível");
    }
    
    console.log('Creating client for business ID:', businessId, clientData);
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error("Usuário não autenticado");
      throw new Error("Usuário não autenticado");
    }
    
    const dataToInsert = {
      business_id: businessId,
      id_negocio: businessId, // Legacy field sync
      name: clientData.name,
      nome: clientData.name, // Legacy field sync
      email: clientData.email || '',
      phone: clientData.phone || '',
      telefone: clientData.phone || '', // Legacy field sync
      birth_date: clientData.birth_date,
      data_nascimento: clientData.birth_date, // Legacy field sync
      gender: clientData.gender,
      genero: clientData.gender, // Legacy field sync
      address: clientData.address,
      endereco: clientData.address, // Legacy field sync
      city: clientData.city,
      cidade: clientData.city, // Legacy field sync
      state: clientData.state,
      estado: clientData.state, // Legacy field sync
      zip_code: clientData.zip_code,
      cep: clientData.zip_code, // Legacy field sync
      notes: clientData.notes,
      notas: clientData.notes, // Legacy field sync
      preferences: clientData.preferences || {},
      preferencias: clientData.preferences || {}, // Legacy field sync
      status: clientData.status || 'active'
    };

    const { data, error } = await supabase
      .from('clients')
      .insert([dataToInsert])
      .select()
      .single();

    if (error) {
      console.error("Error creating client:", error);
      throw error;
    }

    toast.success("Cliente criado com sucesso!");
    return mapDbClientToClient(data);
    
  } catch (err: any) {
    console.error("Error creating client:", err);
    toast.error(err.message || "Erro ao criar cliente");
    throw err;
  }
}

/**
 * Update an existing client
 */
export async function updateClient(id: string, clientData: Partial<Client>): Promise<Client> {
  try {
    const updateData: any = {};
    
    // Map modern fields and legacy fields
    if (clientData.name) {
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
    if (clientData.preferences !== undefined) {
      updateData.preferences = clientData.preferences;
      updateData.preferencias = clientData.preferences;
    }
    if (clientData.status !== undefined) {
      updateData.status = clientData.status;
    }

    const { data, error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating client:", error);
      throw error;
    }

    toast.success("Cliente atualizado com sucesso!");
    return mapDbClientToClient(data);
  } catch (err: any) {
    console.error("Error updating client:", err);
    toast.error(err.message || "Erro ao atualizar cliente");
    throw err;
  }
}

/**
 * Delete a client
 */
export async function deleteClient(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting client:", error);
      throw error;
    }

    toast.success("Cliente excluído com sucesso!");
  } catch (err: any) {
    console.error("Error deleting client:", err);
    toast.error(err.message || "Erro ao excluir cliente");
    throw err;
  }
}

/**
 * Find a client by email
 */
export async function findClientByEmail(email: string, businessId: string): Promise<Client | null> {
  try {
    if (!businessId) {
      throw new Error("ID do negócio não disponível");
    }
    
    console.log('Finding client by email for business ID:', businessId, email);
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .eq('business_id', businessId)
      .maybeSingle();

    if (error) throw error;
    
    if (!data) return null;

    return mapDbClientToClient(data);
    
  } catch (err: any) {
    console.error("Error finding client:", err);
    return null;
  }
}

/**
 * Find a client by phone number
 */
export async function findClientByPhone(phone: string, businessId: string): Promise<Client | null> {
  try {
    if (!businessId) {
      throw new Error("ID do negócio não disponível");
    }
    
    console.log('Finding client by phone for business ID:', businessId, phone);
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('phone', phone)
      .eq('business_id', businessId)
      .maybeSingle();

    if (error) throw error;
    
    if (!data) return null;

    return mapDbClientToClient(data);
    
  } catch (err: any) {
    console.error("Error finding client by phone:", err);
    return null;
  }
}

/**
 * Get client by ID
 */
export async function getClientById(id: string): Promise<Client | null> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows found
      }
      throw error;
    }

    return mapDbClientToClient(data);
  } catch (err: any) {
    console.error("Error fetching client by ID:", err);
    return null;
  }
}
