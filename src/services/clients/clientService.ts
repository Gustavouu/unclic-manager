
import { supabase } from '@/integrations/supabase/client';
import type { Client, ClientFormData } from '@/types/client';

export class ClientService {
  private static instance: ClientService;

  private constructor() {}

  public static getInstance(): ClientService {
    if (!ClientService.instance) {
      ClientService.instance = new ClientService();
    }
    return ClientService.instance;
  }

  async create(data: ClientFormData & { business_id: string }): Promise<Client> {
    const { data: client, error } = await supabase
      .from('clients')
      .insert({
        id: crypto.randomUUID(),
        business_id: data.business_id,
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        birth_date: data.birth_date || null,
        gender: data.gender || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        zip_code: data.zip_code || null,
        notes: data.notes || null,
        status: data.status || 'active',
        preferences: data.preferences || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapToClient(client);
  }

  async update(id: string, data: Partial<ClientFormData>): Promise<Client> {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.birth_date !== undefined) updateData.birth_date = data.birth_date;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.state !== undefined) updateData.state = data.state;
    if (data.zip_code !== undefined) updateData.zip_code = data.zip_code;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.preferences !== undefined) updateData.preferences = data.preferences;

    const { data: client, error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapToClient(client);
  }

  async getById(id: string): Promise<Client> {
    const { data: client, error } = await supabase
      .from('clients')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return this.mapToClient(client);
  }

  async getByBusinessId(businessId: string): Promise<Client[]> {
    const { data: clients, error } = await supabase
      .from('clients')
      .select()
      .eq('business_id', businessId)
      .order('name');

    if (error) throw error;
    return (clients || []).map(client => this.mapToClient(client));
  }

  async search(params: { 
    business_id: string; 
    search?: string;
    status?: string;
    last_visit_from?: string;
    last_visit_to?: string;
  }): Promise<Client[]> {
    let query = supabase
      .from('clients')
      .select()
      .eq('business_id', params.business_id);

    if (params.search) {
      query = query.or(`name.ilike.%${params.search}%,email.ilike.%${params.search}%,phone.ilike.%${params.search}%`);
    }

    if (params.status) {
      query = query.eq('status', params.status);
    }

    if (params.last_visit_from) {
      query = query.gte('last_visit', params.last_visit_from);
    }

    if (params.last_visit_to) {
      query = query.lte('last_visit', params.last_visit_to);
    }

    const { data: clients, error } = await query.order('name');

    if (error) throw error;
    return (clients || []).map(client => this.mapToClient(client));
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getStats(businessId: string): Promise<any> {
    const { data: clients, error } = await supabase
      .from('clients')
      .select('status, created_at, last_visit, total_spent')
      .eq('business_id', businessId);

    if (error) {
      console.warn('Error fetching client stats:', error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        new_this_month: 0,
        total_spent: 0,
        average_spent: 0,
        last_30_days: 0,
      };
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const total = clients?.length || 0;
    const active = clients?.filter(c => c.status === 'active').length || 0;
    const inactive = clients?.filter(c => c.status === 'inactive').length || 0;
    const newThisMonth = clients?.filter(c => {
      if (!c.created_at) return false;
      return new Date(c.created_at) >= startOfMonth;
    }).length || 0;
    const totalSpent = clients?.reduce((sum, c) => sum + (Number(c.total_spent) || 0), 0) || 0;
    const last30Days = clients?.filter(c => {
      if (!c.last_visit) return false;
      return new Date(c.last_visit) >= thirtyDaysAgo;
    }).length || 0;

    return {
      total,
      active,
      inactive,
      new_this_month: newThisMonth,
      total_spent: totalSpent,
      average_spent: total > 0 ? totalSpent / total : 0,
      last_30_days: last30Days,
    };
  }

  private mapToClient(dbClient: any): Client {
    return {
      id: dbClient.id,
      business_id: dbClient.business_id,
      name: dbClient.name,
      email: dbClient.email,
      phone: dbClient.phone,
      birth_date: dbClient.birth_date,
      gender: dbClient.gender,
      address: dbClient.address,
      city: dbClient.city,
      state: dbClient.state,
      zip_code: dbClient.zip_code,
      notes: dbClient.notes,
      status: dbClient.status,
      preferences: dbClient.preferences || {},
      last_visit: dbClient.last_visit,
      total_spent: Number(dbClient.total_spent) || 0,
      created_at: dbClient.created_at,
      updated_at: dbClient.updated_at,
    };
  }
}
