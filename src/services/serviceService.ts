import { supabase } from '@/lib/supabase';
import { Service } from '@/types/business';

export class ServiceService {
  static async getService(serviceId: string): Promise<Service | null> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getServices(businessId: string): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('business_id', businessId);

    if (error) throw error;
    return data;
  }

  static async createService(service: Partial<Service>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .insert(service)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateService(
    serviceId: string,
    service: Partial<Service>
  ): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update(service)
      .eq('id', serviceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteService(serviceId: string): Promise<void> {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId);

    if (error) throw error;
  }
}
