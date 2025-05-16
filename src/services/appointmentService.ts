import { supabase } from '@/lib/supabase';
import { Appointment } from '@/types/business';

export class AppointmentService {
  static async getAppointment(appointmentId: string): Promise<Appointment | null> {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        client:clients(*),
        professional:professionals(*),
        service:services(*)
      `)
      .eq('id', appointmentId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getAppointments(businessId: string): Promise<Appointment[]> {
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

  static async createAppointment(appointment: Partial<Appointment>): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointment)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateAppointment(
    appointmentId: string,
    appointment: Partial<Appointment>
  ): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .update(appointment)
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteAppointment(appointmentId: string): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId);

    if (error) throw error;
  }
}
