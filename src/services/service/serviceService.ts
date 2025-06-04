
import { supabase } from '@/lib/supabase';
import type { Service, ServiceCreate, ServiceUpdate, ServiceSearchParams, ServiceStats } from '@/types/service';

export class ServiceService {
  private static instance: ServiceService;

  private constructor() {}

  public static getInstance(): ServiceService {
    if (!ServiceService.instance) {
      ServiceService.instance = new ServiceService();
    }
    return ServiceService.instance;
  }

  /**
   * Creates a new service
   */
  async create(data: ServiceCreate): Promise<Service> {
    const { data: service, error } = await supabase
      .from('services')
      .insert({
        ...data,
        is_active: data.is_active ?? true,
      })
      .select()
      .single();

    if (error) throw error;
    return service;
  }

  /**
   * Updates an existing service
   */
  async update(id: string, data: ServiceUpdate): Promise<Service> {
    const { data: service, error } = await supabase
      .from('services')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return service;
  }

  /**
   * Gets a service by ID
   */
  async getById(id: string): Promise<Service> {
    const { data: service, error } = await supabase
      .from('services')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return service;
  }

  /**
   * Searches services based on parameters
   */
  async search(params: ServiceSearchParams): Promise<Service[]> {
    let query = supabase
      .from('services')
      .select()
      .eq('business_id', params.business_id);

    if (params.category) {
      query = query.eq('category', params.category);
    }

    if (params.min_price !== undefined) {
      query = query.gte('price', params.min_price);
    }

    if (params.max_price !== undefined) {
      query = query.lte('price', params.max_price);
    }

    if (params.min_duration !== undefined) {
      query = query.gte('duration', params.min_duration);
    }

    if (params.max_duration !== undefined) {
      query = query.lte('duration', params.max_duration);
    }

    if (params.is_active !== undefined) {
      query = query.eq('is_active', params.is_active);
    }

    if (params.search) {
      query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`);
    }

    const { data: services, error } = await query;

    if (error) throw error;
    return services || [];
  }

  /**
   * Gets all services for a business
   */
  async getByBusinessId(businessId: string): Promise<Service[]> {
    const { data: services, error } = await supabase
      .from('services')
      .select()
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return services || [];
  }

  /**
   * Gets service statistics
   */
  async getStats(serviceId: string): Promise<ServiceStats> {
    // Get basic service stats
    const { data: appointments, error: appointmentsError } = await supabase
      .from('Appointments')
      .select('status, valor')
      .eq('id_servico', serviceId);

    if (appointmentsError) {
      console.warn('Error fetching appointments for stats:', appointmentsError);
      return {
        totalAppointments: 0,
        completedAppointments: 0,
        cancelledAppointments: 0,
        noShowAppointments: 0,
        totalRevenue: 0,
        averageRating: 0,
        mostPopularDay: null,
        mostPopularTime: null,
      };
    }

    const total = appointments?.length || 0;
    const completed = appointments?.filter(a => a.status === 'concluido').length || 0;
    const cancelled = appointments?.filter(a => a.status === 'cancelado').length || 0;
    const noShow = appointments?.filter(a => a.status === 'faltou').length || 0;
    const revenue = appointments?.reduce((sum, a) => sum + (Number(a.valor) || 0), 0) || 0;

    return {
      totalAppointments: total,
      completedAppointments: completed,
      cancelledAppointments: cancelled,
      noShowAppointments: noShow,
      totalRevenue: revenue,
      averageRating: 0, // Would need reviews table
      mostPopularDay: null, // Would need more complex query
      mostPopularTime: null, // Would need more complex query
    };
  }

  /**
   * Deletes a service
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
