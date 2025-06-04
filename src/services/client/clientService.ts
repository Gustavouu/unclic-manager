
import { supabase } from '@/lib/supabase';
import type { 
  Client, 
  ClientCreate, 
  ClientUpdate, 
  ClientSearchParams,
  ClientStats
} from '@/types/client';

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
   * Creates a new client
   */
  async create(data: ClientCreate): Promise<Client> {
    const { data: client, error } = await supabase
      .from('clients')
      .insert({
        id_negocio: data.business_id,
        nome: data.name,
        email: data.email,
        telefone: data.phone,
        data_nascimento: data.birth_date,
        genero: data.gender,
        endereco: data.address,
        cidade: data.city,
        estado: data.state,
        cep: data.zip_code,
        notas: data.notes,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapToClient(client);
  }

  /**
   * Updates an existing client
   */
  async update(id: string, data: ClientUpdate): Promise<Client> {
    const updateData: any = {};
    
    if (data.name) updateData.nome = data.name;
    if (data.email) updateData.email = data.email;
    if (data.phone) updateData.telefone = data.phone;
    if (data.birth_date) updateData.data_nascimento = data.birth_date;
    if (data.gender) updateData.genero = data.gender;
    if (data.address) updateData.endereco = data.address;
    if (data.city) updateData.cidade = data.city;
    if (data.state) updateData.estado = data.state;
    if (data.zip_code) updateData.cep = data.zip_code;
    if (data.notes) updateData.notas = data.notes;

    const { data: client, error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapToClient(client);
  }

  /**
   * Gets a client by ID
   */
  async getById(id: string): Promise<Client> {
    const { data: client, error } = await supabase
      .from('clients')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return this.mapToClient(client);
  }

  /**
   * Searches clients based on parameters
   */
  async search(params: ClientSearchParams): Promise<Client[]> {
    let query = supabase
      .from('clients')
      .select()
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

    const { data: clients, error } = await query.order('nome');

    if (error) throw error;
    return clients?.map(client => this.mapToClient(client)) || [];
  }

  /**
   * Gets all clients for a business
   */
  async getByBusinessId(businessId: string): Promise<Client[]> {
    const { data: clients, error } = await supabase
      .from('clients')
      .select()
      .eq('id_negocio', businessId)
      .order('nome');

    if (error) throw error;
    return clients?.map(client => this.mapToClient(client)) || [];
  }

  /**
   * Lists clients by business (alias for getByBusinessId)
   */
  async listByBusiness(businessId: string): Promise<Client[]> {
    return this.getByBusinessId(businessId);
  }

  /**
   * Updates client status
   */
  async updateStatus(id: string, status: string): Promise<Client> {
    const { data: client, error } = await supabase
      .from('clients')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapToClient(client);
  }

  /**
   * Updates client preferences
   */
  async updatePreferences(id: string, preferences: any): Promise<Client> {
    const { data: client, error } = await supabase
      .from('clients')
      .update({ preferencias: preferences })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapToClient(client);
  }

  /**
   * Lists clients by preferred professional
   */
  async listByPreferredProfessional(professionalId: string): Promise<Client[]> {
    const { data: clients, error } = await supabase
      .from('clients')
      .select()
      .contains('preferencias', { preferred_professional: professionalId });

    if (error) throw error;
    return clients?.map(client => this.mapToClient(client)) || [];
  }

  /**
   * Lists clients by preferred service
   */
  async listByPreferredService(serviceId: string): Promise<Client[]> {
    const { data: clients, error } = await supabase
      .from('clients')
      .select()
      .contains('preferencias', { preferred_service: serviceId });

    if (error) throw error;
    return clients?.map(client => this.mapToClient(client)) || [];
  }

  /**
   * Gets client statistics
   */
  async getStats(clientId: string): Promise<ClientStats> {
    // Get client appointments and spending
    const { data: appointments, error: appointmentsError } = await supabase
      .from('Appointments')
      .select('status, valor, data')
      .eq('id_cliente', clientId);

    if (appointmentsError) {
      console.warn('Error fetching client stats:', appointmentsError);
      return {
        totalAppointments: 0,
        completedAppointments: 0,
        cancelledAppointments: 0,
        totalSpent: 0,
        averageSpent: 0,
        lastVisit: null,
        loyaltyPoints: 0,
      };
    }

    const total = appointments?.length || 0;
    const completed = appointments?.filter(a => a.status === 'concluido').length || 0;
    const cancelled = appointments?.filter(a => a.status === 'cancelado').length || 0;
    const totalSpent = appointments?.reduce((sum, a) => sum + (Number(a.valor) || 0), 0) || 0;
    
    const completedAppointments = appointments?.filter(a => a.status === 'concluido') || [];
    const lastVisit = completedAppointments.length > 0 
      ? completedAppointments.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0].data
      : null;

    return {
      totalAppointments: total,
      completedAppointments: completed,
      cancelledAppointments: cancelled,
      totalSpent,
      averageSpent: completed > 0 ? totalSpent / completed : 0,
      lastVisit,
      loyaltyPoints: Math.floor(totalSpent / 10), // Simple loyalty calculation
    };
  }

  /**
   * Deletes a client
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Maps database client to domain client
   */
  private mapToClient(dbClient: any): Client {
    return {
      id: dbClient.id,
      business_id: dbClient.id_negocio,
      name: dbClient.nome,
      email: dbClient.email,
      phone: dbClient.telefone,
      birth_date: dbClient.data_nascimento,
      gender: dbClient.genero,
      address: dbClient.endereco,
      city: dbClient.cidade,
      state: dbClient.estado,
      zip_code: dbClient.cep,
      notes: dbClient.notas,
      preferences: dbClient.preferencias,
      last_visit: dbClient.ultima_visita,
      total_spent: Number(dbClient.valor_total_gasto) || 0,
      total_appointments: 0, // This would need to be calculated separately
      created_at: dbClient.criado_em,
      updated_at: dbClient.atualizado_em,
    };
  }
}
