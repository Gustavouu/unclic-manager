import { supabase } from '@/lib/supabase';
import { Business, BusinessSettings } from '@/types/business';

export class BusinessService {
  static async getBusiness(businessId: string): Promise<Business | null> {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getBusinessSettings(businessId: string): Promise<BusinessSettings | null> {
    const { data, error } = await supabase
      .from('business_settings')
      .select('*')
      .eq('business_id', businessId)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateBusinessSettings(
    businessId: string,
    settings: Partial<BusinessSettings>
  ): Promise<BusinessSettings> {
    const { data, error } = await supabase
      .from('business_settings')
      .update(settings)
      .eq('business_id', businessId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getBusinessUsers(businessId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('business_id', businessId);

    if (error) throw error;
    return data;
  }

  static async getBusinessClients(businessId: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('business_id', businessId);

    if (error) throw error;
    return data;
  }

  static async getBusinessServices(businessId: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('business_id', businessId);

    if (error) throw error;
    return data;
  }

  static async getBusinessProfessionals(businessId: string) {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('business_id', businessId);

    if (error) throw error;
    return data;
  }

  static async getBusinessAppointments(businessId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        client:clients(*),
        professional:professionals(*),
        service:services(*)
      `)
      .eq('business_id', businessId);

    if (error) throw error;
    return data;
  }

  static async createBusiness(business: Partial<Business>): Promise<Business> {
    const { data, error } = await supabase
      .from('businesses')
      .insert(business)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateBusiness(
    businessId: string,
    business: Partial<Business>
  ): Promise<Business> {
    const { data, error } = await supabase
      .from('businesses')
      .update(business)
      .eq('id', businessId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteBusiness(businessId: string): Promise<void> {
    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', businessId);

    if (error) throw error;
  }
}
