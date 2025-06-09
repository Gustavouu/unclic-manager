import { supabase } from '@/lib/supabase';
import type { WaitlistCreate, WaitlistEntry } from '@/types/waitlist';

export class WaitlistService {
  static async add(entry: WaitlistCreate): Promise<WaitlistEntry> {
    const { data, error } = await supabase
      .from('waitlist')
      .insert({
        business_id: entry.business_id,
        client_id: entry.client_id,
        service_id: entry.service_id,
        preferred_date: entry.preferred_date,
        notes: entry.notes
      })
      .select()
      .single();

    if (error) throw error;
    return data as WaitlistEntry;
  }

  static async list(businessId: string, serviceId?: string): Promise<WaitlistEntry[]> {
    let query = supabase
      .from('waitlist')
      .select()
      .eq('business_id', businessId);

    if (serviceId) query = query.eq('service_id', serviceId);

    const { data, error } = await query.order('created_at', { ascending: true });
    if (error) throw error;
    return (data as WaitlistEntry[]) || [];
  }

  static async remove(id: string): Promise<void> {
    const { error } = await supabase.from('waitlist').delete().eq('id', id);
    if (error) throw error;
  }
}
