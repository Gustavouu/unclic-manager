import { supabase } from '@/lib/supabase';
import { Client } from '@/types/business';

export class ClientService {
  static async getClient(clientId: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getClients(businessId: string): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('business_id', businessId);

    if (error) throw error;
    return data;
  }

  static async createClient(client: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateClient(
    clientId: string,
    client: Partial<Client>
  ): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', clientId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteClient(clientId: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);

    if (error) throw error;
  }
}
