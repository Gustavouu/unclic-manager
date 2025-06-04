
import { supabase } from '@/lib/supabase';
import type { 
  Appointment, 
  AppointmentCreate, 
  AppointmentUpdate,
  AppointmentSearchParams,
  AppointmentStats
} from '@/types/appointment';

export class StandardizedAppointmentService {
  private static instance: StandardizedAppointmentService;

  private constructor() {}

  public static getInstance(): StandardizedAppointmentService {
    if (!StandardizedAppointmentService.instance) {
      StandardizedAppointmentService.instance = new StandardizedAppointmentService();
    }
    return StandardizedAppointmentService.instance;
  }

  /**
   * Creates a new appointment
   */
  async create(data: AppointmentCreate): Promise<Appointment> {
    const { data: appointment, error } = await supabase
      .from('appointments_standardized')
      .insert({
        business_id: data.business_id,
        client_id: data.client_id,
        employee_id: data.professional_id,
        service_id: data.service_id,
        booking_date: data.date,
        start_time: data.start_time,
        end_time: data.end_time,
        duration: data.duration,
        price: data.price,
        status: data.status || 'scheduled',
        notes: data.notes,
        payment_method: data.payment_method,
      })
      .select(`
        *,
        clients:client_id(name, email, phone),
        employees:employee_id(name, email),
        services:service_id(name, price, duration)
      `)
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
    if (data.start_time) updateData.start_time = data.start_time;
    if (data.end_time) updateData.end_time = data.end_time;
    if (data.notes) updateData.notes = data.notes;
    if (data.payment_method) updateData.payment_method = data.payment_method;
    if (data.rating) updateData.rating = data.rating;
    if (data.feedback_comment) updateData.feedback_comment = data.feedback_comment;
    if (data.price) updateData.price = data.price;

    const { data: appointment, error } = await supabase
      .from('appointments_standardized')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        clients:client_id(name, email, phone),
        employees:employee_id(name, email),
        services:service_id(name, price, duration)
      `)
      .single();

    if (error) throw error;
    return this.mapToAppointment(appointment);
  }

  /**
   * Gets an appointment by ID
   */
  async getById(id: string): Promise<Appointment> {
    const { data: appointment, error } = await supabase
      .from('appointments_standardized')
      .select(`
        *,
        clients:client_id(name, email, phone),
        employees:employee_id(name, email),
        services:service_id(name, price, duration)
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
      .from('appointments_standardized')
      .select(`
        *,
        clients:client_id(name, email, phone),
        employees:employee_id(name, email),
        services:service_id(name, price, duration)
      `)
      .eq('business_id', params.business_id);

    if (params.status) {
      query = query.eq('status', params.status);
    }

    if (params.client_id) {
      query = query.eq('client_id', params.client_id);
    }

    if (params.professional_id) {
      query = query.eq('employee_id', params.professional_id);
    }

    if (params.service_id) {
      query = query.eq('service_id', params.service_id);
    }

    if (params.date_from) {
      query = query.gte('booking_date', params.date_from);
    }

    if (params.date_to) {
      query = query.lte('booking_date', params.date_to);
    }

    const { data: appointments, error } = await query.order('booking_date', { ascending: false });

    if (error) throw error;
    return appointments?.map(apt => this.mapToAppointment(apt)) || [];
  }

  /**
   * Gets appointments for a specific date range
   */
  async getByDateRange(businessId: string, startDate: string, endDate: string): Promise<Appointment[]> {
    const { data: appointments, error } = await supabase
      .from('appointments_standardized')
      .select(`
        *,
        clients:client_id(name, email, phone),
        employees:employee_id(name, email),
        services:service_id(name, price, duration)
      `)
      .eq('business_id', businessId)
      .gte('booking_date', startDate)
      .lte('booking_date', endDate)
      .order('booking_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) throw error;
    return appointments?.map(apt => this.mapToAppointment(apt)) || [];
  }

  /**
   * Gets appointment statistics
   */
  async getStats(businessId: string, dateFrom?: string, dateTo?: string): Promise<AppointmentStats> {
    let query = supabase
      .from('appointments_standardized')
      .select('status, price')
      .eq('business_id', businessId);

    if (dateFrom) query = query.gte('booking_date', dateFrom);
    if (dateTo) query = query.lte('booking_date', dateTo);

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
    const scheduled = appointments?.filter(a => a.status === 'scheduled').length || 0;
    const confirmed = appointments?.filter(a => a.status === 'confirmed').length || 0;
    const completed = appointments?.filter(a => a.status === 'completed').length || 0;
    const cancelled = appointments?.filter(a => a.status === 'canceled').length || 0;
    const noShow = appointments?.filter(a => a.status === 'no_show').length || 0;
    const totalRevenue = appointments?.reduce((sum, a) => sum + (Number(a.price) || 0), 0) || 0;

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
      .from('appointments_standardized')
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
      business_id: dbAppointment.business_id,
      client_id: dbAppointment.client_id,
      professional_id: dbAppointment.employee_id,
      service_id: dbAppointment.service_id,
      date: dbAppointment.booking_date,
      start_time: dbAppointment.start_time,
      end_time: dbAppointment.end_time,
      duration: dbAppointment.duration,
      price: Number(dbAppointment.price),
      status: dbAppointment.status,
      notes: dbAppointment.notes,
      payment_method: dbAppointment.payment_method,
      rating: dbAppointment.rating,
      feedback_comment: dbAppointment.feedback_comment,
      reminder_sent: dbAppointment.reminder_sent,
      client_name: dbAppointment.clients?.name,
      professional_name: dbAppointment.employees?.name,
      service_name: dbAppointment.services?.name,
      created_at: dbAppointment.created_at,
      updated_at: dbAppointment.updated_at,
    };
  }
}
