
import { supabase } from '@/lib/supabase';
import type { Client, ClientFormData, ClientSearchParams } from '@/types/client';

export async function fetchClients(params: ClientSearchParams = { business_id: '' }): Promise<Client[]> {
  try {
    let query = supabase
      .from('clients')
      .select('*')
      .eq('id_negocio', params.business_id);

    if (params.search) {
      query = query.or(`nome.ilike.%${params.search}%,email.ilike.%${params.search}%,telefone.ilike.%${params.search}%`);
    }

    if (params.city) {
      query = query.eq('cidade', params.city);
    }

    if (params.state) {
      query = query.eq('estado', params.state);
    }

    // Handle pagination
    if (params.page && params.limit) {
      const from = (params.page - 1) * params.limit;
      const to = from + params.limit - 1;
      query = query.range(from, to);
    }

    const { data, error } = await query.order('nome');

    if (error) throw error;

    return data?.map(mapDbClientToClient) || [];
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
}

export async function createClientApi(businessId: string, clientData: ClientFormData): Promise<Client> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert({
        id_negocio: businessId,
        nome: clientData.name,
        email: clientData.email,
        telefone: clientData.phone,
        data_nascimento: clientData.birth_date,
        genero: clientData.gender,
        endereco: clientData.address,
        cidade: clientData.city,
        estado: clientData.state,
        cep: clientData.zip_code,
        notas: clientData.notes,
      })
      .select()
      .single();

    if (error) throw error;

    return mapDbClientToClient(data);
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
}

function mapDbClientToClient(dbClient: any): Client {
  return {
    id: dbClient.id,
    business_id: dbClient.id_negocio,
    name: dbClient.nome,
    email: dbClient.email || '',
    phone: dbClient.telefone || '',
    birth_date: dbClient.data_nascimento || '',
    gender: dbClient.genero || '',
    address: dbClient.endereco || '',
    city: dbClient.cidade || '',
    state: dbClient.estado || '',
    zip_code: dbClient.cep || '',
    notes: dbClient.notas || '',
    preferences: dbClient.preferencias || {},
    last_visit: dbClient.ultima_visita,
    total_spent: Number(dbClient.valor_total_gasto) || 0,
    total_appointments: 0,
    status: dbClient.status || 'active',
    created_at: dbClient.criado_em,
    updated_at: dbClient.atualizado_em,
  };
}
