
import { supabase } from '@/integrations/supabase/client';

export class BusinessService {
  static async createBusiness(data: any) {
    const { data: business, error } = await supabase
      .from('businesses')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return business;
  }

  static async updateBusinessSettings(businessId: string, settings: any) {
    const { data, error } = await supabase
      .from('business_settings')
      .update(settings)
      .eq('business_id', businessId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const businessService = BusinessService;
