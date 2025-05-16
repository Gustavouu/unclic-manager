import { supabase } from '@/lib/supabase';
import { Professional, ProfessionalSchedule } from '@/types/business';

export class ProfessionalService {
  static async getProfessional(professionalId: string): Promise<Professional | null> {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', professionalId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getProfessionals(businessId: string): Promise<Professional[]> {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('business_id', businessId);

    if (error) throw error;
    return data;
  }

  static async createProfessional(professional: Partial<Professional>): Promise<Professional> {
    const { data, error } = await supabase
      .from('professionals')
      .insert(professional)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateProfessional(
    professionalId: string,
    professional: Partial<Professional>
  ): Promise<Professional> {
    const { data, error } = await supabase
      .from('professionals')
      .update(professional)
      .eq('id', professionalId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteProfessional(professionalId: string): Promise<void> {
    const { error } = await supabase
      .from('professionals')
      .delete()
      .eq('id', professionalId);

    if (error) throw error;
  }

  static async getSchedules(professionalId: string): Promise<ProfessionalSchedule[]> {
    const { data, error } = await supabase
      .from('professional_schedules')
      .select('*')
      .eq('professional_id', professionalId);

    if (error) throw error;
    return data;
  }

  static async createSchedule(schedule: Partial<ProfessionalSchedule>): Promise<ProfessionalSchedule> {
    const { data, error } = await supabase
      .from('professional_schedules')
      .insert(schedule)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateSchedule(
    scheduleId: string,
    schedule: Partial<ProfessionalSchedule>
  ): Promise<ProfessionalSchedule> {
    const { data, error } = await supabase
      .from('professional_schedules')
      .update(schedule)
      .eq('id', scheduleId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteSchedule(scheduleId: string): Promise<void> {
    const { error } = await supabase
      .from('professional_schedules')
      .delete()
      .eq('id', scheduleId);

    if (error) throw error;
  }
}
