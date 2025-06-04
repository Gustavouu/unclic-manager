
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Client } from '@/types/client';

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

    return (data || []).map(client => ({
      id: client.id,
      business_id: client.business_id || client.id_negocio,
      name: client.name || client.nome,
      email: client.email || '',
      phone: client.phone || client.telefone || '',
      birth_date: client.birth_date || client.data_nascimento || '',
      gender: client.gender || client.genero || '',
      address: client.address || client.endereco || '',
      city: client.city || client.cidade || '',
      state: client.state || client.estado || '',
      zip_code: client.zip_code || client.cep || '',
      notes: client.notes || client.notas || '',
      preferences: client.preferencias || {},
      last_visit: client.last_visit || client.ultima_visita,
      total_spent: Number(client.total_spent || client.valor_total_gasto) || 0,
      total_appointments: 0, // This field doesn't exist in the database, so we default to 0
      status: client.status || 'active',
      created_at: client.created_at || client.criado_em,
      updated_at: client.updated_at || client.atualizado_em,
    }));
  } catch (err: any) {
    console.error("Erro inesperado ao buscar clientes:", err);
    throw err;
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
      ...clientData,
      business_id: businessId,
      id_negocio: businessId, // Also set legacy field
      nome: clientData.name, // Set legacy field
      telefone: clientData.phone, // Set legacy field
      endereco: clientData.address, // Set legacy field
      cidade: clientData.city, // Set legacy field
      estado: clientData.state, // Set legacy field
      cep: clientData.zip_code, // Set legacy field
      notas: clientData.notes, // Set legacy field
      genero: clientData.gender, // Set legacy field
      data_nascimento: clientData.birth_date, // Set legacy field
      preferencias: clientData.preferences || {}, // Set legacy field
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

    return {
      id: data.id,
      business_id: data.business_id || data.id_negocio,
      name: data.name || data.nome,
      email: data.email || '',
      phone: data.phone || data.telefone || '',
      birth_date: data.birth_date || data.data_nascimento || '',
      gender: data.gender || data.genero || '',
      address: data.address || data.endereco || '',
      city: data.city || data.cidade || '',
      state: data.state || data.estado || '',
      zip_code: data.zip_code || data.cep || '',
      notes: data.notes || data.notas || '',
      preferences: data.preferencias || {},
      last_visit: data.last_visit || data.ultima_visita,
      total_spent: Number(data.total_spent || data.valor_total_gasto) || 0,
      total_appointments: 0, // This field doesn't exist in the database, so we default to 0
      status: data.status || 'active',
      created_at: data.created_at || data.criado_em,
      updated_at: data.updated_at || data.atualizado_em,
    };
    
  } catch (err: any) {
    console.error("Error creating client:", err);
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

    return {
      id: data.id,
      business_id: data.business_id || data.id_negocio,
      name: data.name || data.nome,
      email: data.email || '',
      phone: data.phone || data.telefone || '',
      birth_date: data.birth_date || data.data_nascimento || '',
      gender: data.gender || data.genero || '',
      address: data.address || data.endereco || '',
      city: data.city || data.cidade || '',
      state: data.state || data.estado || '',
      zip_code: data.zip_code || data.cep || '',
      notes: data.notes || data.notas || '',
      preferences: data.preferencias || {},
      last_visit: data.last_visit || data.ultima_visita,
      total_spent: Number(data.total_spent || data.valor_total_gasto) || 0,
      total_appointments: 0, // This field doesn't exist in the database, so we default to 0
      status: data.status || 'active',
      created_at: data.created_at || data.criado_em,
      updated_at: data.updated_at || data.atualizado_em,
    };
    
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

    return {
      id: data.id,
      business_id: data.business_id || data.id_negocio,
      name: data.name || data.nome,
      email: data.email || '',
      phone: data.phone || data.telefone || '',
      birth_date: data.birth_date || data.data_nascimento || '',
      gender: data.gender || data.genero || '',
      address: data.address || data.endereco || '',
      city: data.city || data.cidade || '',
      state: data.state || data.estado || '',
      zip_code: data.zip_code || data.cep || '',
      notes: data.notes || data.notas || '',
      preferences: data.preferencias || {},
      last_visit: data.last_visit || data.ultima_visita,
      total_spent: Number(data.total_spent || data.valor_total_gasto) || 0,
      total_appointments: 0, // This field doesn't exist in the database, so we default to 0
      status: data.status || 'active',
      created_at: data.created_at || data.criado_em,
      updated_at: data.updated_at || data.atualizado_em,
    };
    
  } catch (err: any) {
    console.error("Error finding client by phone:", err);
    return null;
  }
}
