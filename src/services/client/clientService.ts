import { supabase } from '@/lib/supabase';
import type { Client, ClientCreate, ClientUpdate, ClientStats } from '@/types/client';

export class ClientService {
  private static instance: ClientService;

  private constructor() {}

  public static getInstance(): ClientService {
    if (!ClientService.instance) {
      ClientService.instance = new ClientService();
    }
    return ClientService.instance;
  }

  /**
   * Cria um novo cliente
   */
  async create(data: ClientCreate): Promise<Client> {
    const { data: client, error } = await supabase
      .from('clients')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return client;
  }

  /**
   * Atualiza um cliente existente
   */
  async update(id: string, data: ClientUpdate): Promise<Client> {
    const { data: client, error } = await supabase
      .from('clients')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return client;
  }

  /**
   * Busca um cliente pelo ID
   */
  async getById(id: string): Promise<Client> {
    const { data: client, error } = await supabase
      .from('clients')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return client;
  }

  /**
   * Lista todos os clientes de um negócio
   */
  async listByBusiness(businessId: string): Promise<Client[]> {
    const { data: clients, error } = await supabase
      .from('clients')
      .select()
      .eq('business_id', businessId);

    if (error) throw error;
    return clients;
  }

  /**
   * Busca clientes por nome ou email
   */
  async search(businessId: string, query: string): Promise<Client[]> {
    const { data: clients, error } = await supabase
      .from('clients')
      .select()
      .eq('business_id', businessId)
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`);

    if (error) throw error;
    return clients;
  }

  /**
   * Deleta um cliente
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Atualiza o status do cliente
   */
  async updateStatus(id: string, status: 'active' | 'inactive' | 'blocked'): Promise<Client> {
    const { data: client, error } = await supabase
      .from('clients')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return client;
  }

  /**
   * Atualiza as preferências do cliente
   */
  async updatePreferences(id: string, preferences: Partial<Client['preferences']>): Promise<Client> {
    const { data: client, error } = await supabase
      .from('clients')
      .update({ preferences })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return client;
  }

  /**
   * Busca estatísticas do cliente
   */
  async getStats(id: string): Promise<ClientStats> {
    const { data, error } = await supabase.rpc('get_client_stats', {
      client_id: id,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Busca clientes por profissional preferido
   */
  async listByPreferredProfessional(businessId: string, professionalId: string): Promise<Client[]> {
    const { data: clients, error } = await supabase
      .from('clients')
      .select()
      .eq('business_id', businessId)
      .contains('preferences->preferred_professionals', [professionalId]);

    if (error) throw error;
    return clients;
  }

  /**
   * Busca clientes por serviço preferido
   */
  async listByPreferredService(businessId: string, serviceId: string): Promise<Client[]> {
    const { data: clients, error } = await supabase
      .from('clients')
      .select()
      .eq('business_id', businessId)
      .contains('preferences->preferred_services', [serviceId]);

    if (error) throw error;
    return clients;
  }
} 