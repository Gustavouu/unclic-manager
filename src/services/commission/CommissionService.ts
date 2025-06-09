import { supabase } from '@/lib/supabase';

export class CommissionService {
  static async calculateForAppointment(appointmentId: string) {
    const { data, error } = await supabase.rpc('calculate_commission', { appointment_id: appointmentId });
    if (error) throw error;
    return data;
  }

  static async listForProfessional(professionalId: string) {
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('professional_id', professionalId)
      .eq('type', 'commission');

    if (error) throw error;
    return data || [];
  }
}
