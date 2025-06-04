
import { supabase } from '@/lib/supabase';
import type { 
  Appointment, 
  AppointmentCreate, 
  AppointmentUpdate,
  AppointmentSearchParams,
  AppointmentStats
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
   * Creates a new appointment
   */
  async create(data: AppointmentCreate): Promise<Appointment> {
    const { data: appointment, error } = await supabase
      .from('Appointments')
      .insert({
        id_negocio: data.business_id,
        id_cliente: data.client_id,
        id_funcionario: data.professional_id,
        id_servico: data.service_id,
        data: data.date,
        hora_inicio: data.start_time,
        hora_fim: data.end_time,
        duracao: data.duration,
        valor: data.price,
        status: data.status || 'agendado',
        observacoes: data.notes,
        forma_pagamento: data.payment_method,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapToAppointment(appointment);
  }

  /**
   * Updates an existing appointment
   */
  async update(id: string, data: AppointmentUpdate): Promise<Appointment> {
    const updateData: any = {};
    
    if (data.status) updateData.status = data.status;
    if (data.start_time) updateData.hora_inicio = data.start_time;
    if (data.end_time) updateData.hora_fim = data.end_time;
    if (data.notes) updateData.observacoes = data.notes;
    if (data.payment_method) updateData.forma_pagamento = data.payment_method;
    if (data.rating) updateData.avaliacao = data.rating;
    if (data.feedback_comment) updateData.comentario_avaliacao = data.feedback_comment;

    const { data: appointment, error } = await supabase
      .from('Appointments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapToAppointment(appointment);
  }

  /**
   * Gets an appointment by ID
   */
  async getById(id: string): Promise<Appointment> {
    const { data: appointment, error } = await supabase
      .from('Appointments')
      .select(`
        *,
        clientes:id_cliente(nome, email, telefone),
        funcionarios:id_funcionario(nome, email),
        servicos:id_servico(nome, preco, duracao)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return this.mapToAppointment(appointment);
  }

  /**
   * Searches appointments based on parameters
   */
  async search(params: AppointmentSearchParams): Promise<Appointment[]> {
    let query = supabase
      .from('Appointments')
      .select(`
        *,
        clientes:id_cliente(nome, email, telefone),
        funcionarios:id_funcionario(nome, email),
        servicos:id_servico(nome, preco, duracao)
      `)
      .eq('id_negocio', params.business_id);

    if (params.status) {
      query = query.eq('status', params.status);
    }

    if (params.client_id) {
      query = query.eq('id_cliente', params.client_id);
    }

    if (params.professional_id) {
      query = query.eq('id_funcionario', params.professional_id);
    }

    if (params.service_id) {
      query = query.eq('id_servico', params.service_id);
    }

    if (params.date_from) {
      query = query.gte('data', params.date_from);
    }

    if (params.date_to) {
      query = query.lte('data', params.date_to);
    }

    const { data: appointments, error } = await query.order('data', { ascending: false });

    if (error) throw error;
    return appointments?.map(apt => this.mapToAppointment(apt)) || [];
  }

  /**
   * Gets appointments for a specific date range
   */
  async getByDateRange(businessId: string, startDate: string, endDate: string): Promise<Appointment[]> {
    const { data: appointments, error } = await supabase
      .from('Appointments')
      .select(`
        *,
        clientes:id_cliente(nome, email, telefone),
        funcionarios:id_funcionario(nome, email),
        servicos:id_servico(nome, preco, duracao)
      `)
      .eq('id_negocio', businessId)
      .gte('data', startDate)
      .lte('data', endDate)
      .order('data', { ascending: true })
      .order('hora_inicio', { ascending: true });

    if (error) throw error;
    return appointments?.map(apt => this.mapToAppointment(apt)) || [];
  }

  /**
   * Gets appointment statistics
   */
  async getStats(businessId: string, dateFrom?: string, dateTo?: string): Promise<AppointmentStats> {
    let query = supabase
      .from('Appointments')
      .select('status, valor')
      .eq('id_negocio', businessId);

    if (dateFrom) query = query.gte('data', dateFrom);
    if (dateTo) query = query.lte('data', dateTo);

    const { data: appointments, error } = await query;

    if (error) {
      console.warn('Error fetching appointment stats:', error);
      return {
        total: 0,
        scheduled: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        no_show: 0,
        total_revenue: 0,
        average_value: 0,
        completion_rate: 0,
        cancellation_rate: 0,
      };
    }

    const total = appointments?.length || 0;
    const scheduled = appointments?.filter(a => a.status === 'agendado').length || 0;
    const confirmed = appointments?.filter(a => a.status === 'confirmado').length || 0;
    const completed = appointments?.filter(a => a.status === 'concluido').length || 0;
    const cancelled = appointments?.filter(a => a.status === 'cancelado').length || 0;
    const noShow = appointments?.filter(a => a.status === 'faltou').length || 0;
    const totalRevenue = appointments?.reduce((sum, a) => sum + (Number(a.valor) || 0), 0) || 0;

    return {
      total,
      scheduled,
      confirmed,
      completed,
      cancelled,
      no_show: noShow,
      total_revenue: totalRevenue,
      average_value: total > 0 ? totalRevenue / total : 0,
      completion_rate: total > 0 ? (completed / total) * 100 : 0,
      cancellation_rate: total > 0 ? (cancelled / total) * 100 : 0,
    };
  }

  /**
   * Deletes an appointment
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('Appointments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Maps database appointment to domain appointment
   */
  private mapToAppointment(dbAppointment: any): Appointment {
    return {
      id: dbAppointment.id,
      business_id: dbAppointment.id_negocio,
      client_id: dbAppointment.id_cliente,
      professional_id: dbAppointment.id_funcionario,
      service_id: dbAppointment.id_servico,
      date: dbAppointment.data,
      start_time: dbAppointment.hora_inicio,
      end_time: dbAppointment.hora_fim,
      duration: dbAppointment.duracao,
      price: Number(dbAppointment.valor),
      status: dbAppointment.status,
      notes: dbAppointment.observacoes,
      payment_method: dbAppointment.forma_pagamento,
      rating: dbAppointment.avaliacao,
      feedback_comment: dbAppointment.comentario_avaliacao,
      reminder_sent: dbAppointment.lembrete_enviado,
      client_name: dbAppointment.clientes?.nome,
      professional_name: dbAppointment.funcionarios?.nome,
      service_name: dbAppointment.servicos?.nome,
      created_at: dbAppointment.criado_em,
      updated_at: dbAppointment.atualizado_em,
    };
  }
}
