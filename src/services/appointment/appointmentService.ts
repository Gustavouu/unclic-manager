import { supabase } from '@/lib/supabase';
import type {
  Appointment,
  AppointmentCreate,
  AppointmentUpdate,
  AppointmentStats,
  AppointmentSearchParams,
  AppointmentConflict,
} from '@/types/appointment';

export class AppointmentService {
  private static instance: AppointmentService;

  private constructor() {}

  public static getInstance(): AppointmentService {
    if (!AppointmentService.instance) {
      AppointmentService.instance = new AppointmentService();
    }
    return AppointmentService.instance;
  }

  /**
   * Cria um novo agendamento
   */
  async create(data: AppointmentCreate): Promise<Appointment> {
    // Verifica conflitos antes de criar
    const conflicts = await this.checkConflicts(data);
    if (conflicts.length > 0) {
      throw new Error('Existem conflitos de horário: ' + conflicts.map(c => c.conflict_details).join(', '));
    }

    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return appointment;
  }

  /**
   * Atualiza um agendamento existente
   */
  async update(id: string, data: AppointmentUpdate): Promise<Appointment> {
    // Se houver mudança de horário, verifica conflitos
    if (data.start_time || data.end_time) {
      const currentAppointment = await this.getById(id);
      const conflicts = await this.checkConflicts({
        ...currentAppointment,
        ...data,
      });
      if (conflicts.length > 0) {
        throw new Error('Existem conflitos de horário: ' + conflicts.map(c => c.conflict_details).join(', '));
      }
    }

    const { data: appointment, error } = await supabase
      .from('appointments')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return appointment;
  }

  /**
   * Busca um agendamento pelo ID
   */
  async getById(id: string): Promise<Appointment> {
    const { data: appointment, error } = await supabase
      .from('appointments')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return appointment;
  }

  /**
   * Lista agendamentos com base nos parâmetros de busca
   */
  async search(params: AppointmentSearchParams): Promise<Appointment[]> {
    let query = supabase
      .from('appointments')
      .select()
      .eq('business_id', params.business_id);

    if (params.client_id) {
      query = query.eq('client_id', params.client_id);
    }

    if (params.professional_id) {
      query = query.eq('professional_id', params.professional_id);
    }

    if (params.service_id) {
      query = query.eq('service_id', params.service_id);
    }

    if (params.status) {
      query = query.eq('status', params.status);
    }

    if (params.payment_status) {
      query = query.eq('payment_status', params.payment_status);
    }

    if (params.start_date) {
      query = query.gte('start_time', params.start_date);
    }

    if (params.end_date) {
      query = query.lte('end_time', params.end_date);
    }

    if (params.start_time) {
      query = query.gte('start_time', params.start_time);
    }

    if (params.end_time) {
      query = query.lte('end_time', params.end_time);
    }

    const { data: appointments, error } = await query;

    if (error) throw error;
    return appointments;
  }

  /**
   * Deleta um agendamento
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Atualiza o status do agendamento
   */
  async updateStatus(
    id: string,
    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show',
    cancellationReason?: string,
    cancellationFee?: number
  ): Promise<Appointment> {
    const updateData: AppointmentUpdate = {
      status,
      cancellation_reason: cancellationReason || null,
      cancellation_fee: cancellationFee || null,
    };

    const { data: appointment, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return appointment;
  }

  /**
   * Atualiza o status de pagamento do agendamento
   */
  async updatePaymentStatus(
    id: string,
    paymentStatus: 'pending' | 'paid' | 'refunded' | 'partially_paid',
    paymentMethod?: 'credit_card' | 'debit_card' | 'cash' | 'pix'
  ): Promise<Appointment> {
    const updateData: AppointmentUpdate = {
      payment_status: paymentStatus,
      payment_method: paymentMethod || null,
    };

    const { data: appointment, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return appointment;
  }

  /**
   * Busca estatísticas dos agendamentos
   */
  async getStats(businessId: string): Promise<AppointmentStats> {
    const { data, error } = await supabase.rpc('get_appointment_stats', {
      business_id: businessId,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Verifica conflitos de horário
   */
  private async checkConflicts(appointment: Partial<Appointment>): Promise<AppointmentConflict[]> {
    if (!appointment.start_time || !appointment.end_time || !appointment.professional_id) {
      return [];
    }

    const { data: conflicts, error } = await supabase.rpc('check_appointment_conflicts', {
      p_start_time: appointment.start_time,
      p_end_time: appointment.end_time,
      p_professional_id: appointment.professional_id,
      p_client_id: appointment.client_id,
      p_service_id: appointment.service_id,
      p_appointment_id: appointment.id,
    });

    if (error) throw error;
    return conflicts;
  }
} 