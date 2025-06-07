
import { supabase } from '@/integrations/supabase/client';
import type { 
  Appointment, 
  AppointmentCreate, 
  AppointmentUpdate, 
  AppointmentSearchParams,
  AppointmentStats 
} from '@/types/appointment';

export class StandardizedAppointmentService {
  private static instance: StandardizedAppointmentService;

  public static getInstance(): StandardizedAppointmentService {
    if (!StandardizedAppointmentService.instance) {
      StandardizedAppointmentService.instance = new StandardizedAppointmentService();
    }
    return StandardizedAppointmentService.instance;
  }

  async create(data: AppointmentCreate): Promise<Appointment> {
    console.log('Creating appointment with data:', data);
    
    const { data: appointment, error } = await supabase
      .from('bookings')
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
        payment_method: data.payment_method
      })
      .select(`
        *,
        clients:client_id(name, email, phone),
        services:service_id(name, description, price, duration),
        professionals:employee_id(name, email, phone)
      `)
      .single();

    if (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }

    console.log('Created appointment:', appointment);
    return this.mapToStandardAppointment(appointment);
  }

  async search(params: AppointmentSearchParams): Promise<Appointment[]> {
    console.log('Searching appointments with params:', params);
    
    let query = supabase
      .from('bookings')
      .select(`
        *,
        clients:client_id(name, email, phone),
        services:service_id(name, description, price, duration),
        professionals:employee_id(name, email, phone)
      `)
      .eq('business_id', params.business_id)
      .order('booking_date', { ascending: false })
      .order('start_time', { ascending: false });

    if (params.client_id) {
      query = query.eq('client_id', params.client_id);
    }

    if (params.professional_id) {
      query = query.eq('employee_id', params.professional_id);
    }

    if (params.service_id) {
      query = query.eq('service_id', params.service_id);
    }

    if (params.status) {
      query = query.eq('status', params.status);
    }

    if (params.date_from) {
      query = query.gte('booking_date', params.date_from);
    }

    if (params.date_to) {
      query = query.lte('booking_date', params.date_to);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error searching appointments:', error);
      throw error;
    }

    console.log('Found appointments:', data?.length || 0);
    
    if (!data) return [];

    const mappedAppointments = data.map(appointment => this.mapToStandardAppointment(appointment));
    console.log('Mapped appointments:', mappedAppointments);
    
    return mappedAppointments;
  }

  async update(id: string, data: AppointmentUpdate): Promise<Appointment> {
    console.log('Updating appointment:', id, data);
    
    const updateData: any = {};
    
    if (data.status) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.payment_method) updateData.payment_method = data.payment_method;
    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.feedback_comment !== undefined) updateData.feedback_comment = data.feedback_comment;
    if (data.start_time) updateData.start_time = data.start_time;
    if (data.end_time) updateData.end_time = data.end_time;
    if (data.price !== undefined) updateData.price = data.price;

    const { data: appointment, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        clients:client_id(name, email, phone),
        services:service_id(name, description, price, duration),
        professionals:employee_id(name, email, phone)
      `)
      .single();

    if (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }

    return this.mapToStandardAppointment(appointment);
  }

  async delete(id: string): Promise<void> {
    console.log('Deleting appointment:', id);
    
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }

  async getByDateRange(businessId: string, startDate: string, endDate: string): Promise<Appointment[]> {
    console.log('Getting appointments by date range:', { businessId, startDate, endDate });
    
    return this.search({
      business_id: businessId,
      date_from: startDate,
      date_to: endDate
    });
  }

  async getStats(businessId: string, dateFrom?: string, dateTo?: string): Promise<AppointmentStats> {
    console.log('Getting appointment stats:', { businessId, dateFrom, dateTo });
    
    let query = supabase
      .from('bookings')
      .select('status, price')
      .eq('business_id', businessId);

    if (dateFrom) {
      query = query.gte('booking_date', dateFrom);
    }

    if (dateTo) {
      query = query.lte('booking_date', dateTo);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error getting appointment stats:', error);
      throw error;
    }

    if (!data) {
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
        cancellation_rate: 0
      };
    }

    const stats: AppointmentStats = {
      total: data.length,
      scheduled: data.filter(apt => apt.status === 'scheduled').length,
      confirmed: data.filter(apt => apt.status === 'confirmed').length,
      completed: data.filter(apt => apt.status === 'completed').length,
      cancelled: data.filter(apt => apt.status === 'canceled').length,
      no_show: data.filter(apt => apt.status === 'no_show').length,
      total_revenue: data.reduce((sum, apt) => sum + (apt.price || 0), 0),
      average_value: 0,
      completion_rate: 0,
      cancellation_rate: 0
    };

    if (stats.total > 0) {
      stats.average_value = stats.total_revenue / stats.total;
      stats.completion_rate = (stats.completed / stats.total) * 100;
      stats.cancellation_rate = ((stats.cancelled + stats.no_show) / stats.total) * 100;
    }

    return stats;
  }

  private mapToStandardAppointment(appointment: any): Appointment {
    const mapped: Appointment = {
      id: appointment.id,
      business_id: appointment.business_id,
      client_id: appointment.client_id,
      professional_id: appointment.employee_id,
      service_id: appointment.service_id,
      date: appointment.booking_date,
      start_time: appointment.start_time,
      end_time: appointment.end_time,
      duration: appointment.duration,
      price: appointment.price,
      status: appointment.status,
      notes: appointment.notes,
      payment_method: appointment.payment_method,
      rating: appointment.rating,
      feedback_comment: appointment.feedback_comment,
      reminder_sent: appointment.reminder_sent,
      client_name: appointment.clients?.name,
      professional_name: appointment.professionals?.name,
      service_name: appointment.services?.name,
      created_at: appointment.created_at,
      updated_at: appointment.updated_at
    };

    console.log('Mapped appointment:', mapped);
    return mapped;
  }
}
