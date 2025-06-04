
import { supabase } from '@/lib/supabase';
import type { 
  Professional, 
  ProfessionalCreate, 
  ProfessionalUpdate, 
  ProfessionalSearchParams,
  ProfessionalStats,
  ProfessionalAvailability
} from '@/types/professional';

export class ProfessionalService {
  private static instance: ProfessionalService;

  private constructor() {}

  public static getInstance(): ProfessionalService {
    if (!ProfessionalService.instance) {
      ProfessionalService.instance = new ProfessionalService();
    }
    return ProfessionalService.instance;
  }

  /**
   * Creates a new professional
   */
  async create(data: ProfessionalCreate): Promise<Professional> {
    const { data: professional, error } = await supabase
      .from('professionals')
      .insert({
        ...data,
        status: data.status || 'active',
        rating: 0,
        total_reviews: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return professional;
  }

  /**
   * Updates an existing professional
   */
  async update(id: string, data: ProfessionalUpdate): Promise<Professional> {
    const { data: professional, error } = await supabase
      .from('professionals')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return professional;
  }

  /**
   * Gets a professional by ID
   */
  async getById(id: string): Promise<Professional> {
    const { data: professional, error } = await supabase
      .from('professionals')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return professional;
  }

  /**
   * Searches professionals based on parameters
   */
  async search(params: ProfessionalSearchParams): Promise<Professional[]> {
    let query = supabase
      .from('professionals')
      .select()
      .eq('business_id', params.business_id);

    if (params.status) {
      query = query.eq('status', params.status);
    }

    if (params.specialty) {
      query = query.contains('specialties', [params.specialty]);
    }

    if (params.rating !== undefined) {
      query = query.gte('rating', params.rating);
    }

    if (params.search) {
      query = query.or(`name.ilike.%${params.search}%,email.ilike.%${params.search}%`);
    }

    const { data: professionals, error } = await query;

    if (error) throw error;
    return professionals || [];
  }

  /**
   * Gets all professionals for a business
   */
  async getByBusinessId(businessId: string): Promise<Professional[]> {
    const { data: professionals, error } = await supabase
      .from('professionals')
      .select()
      .eq('business_id', businessId)
      .eq('status', 'active')
      .order('name');

    if (error) throw error;
    return professionals || [];
  }

  /**
   * Gets professional statistics
   */
  async getStats(professionalId: string): Promise<ProfessionalStats> {
    // Get basic professional stats from appointments
    const { data: appointments, error: appointmentsError } = await supabase
      .from('Appointments')
      .select('status, valor, id_servico')
      .eq('id_funcionario', professionalId);

    if (appointmentsError) {
      console.warn('Error fetching appointments for stats:', appointmentsError);
      return {
        totalAppointments: 0,
        completedAppointments: 0,
        cancelledAppointments: 0,
        noShowAppointments: 0,
        averageRating: 0,
        totalRevenue: 0,
        mostPopularService: '',
        busiestDay: '',
        busiestTime: '',
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
      averageRating: 0, // Would need reviews table
      totalRevenue: revenue,
      mostPopularService: '', // Would need more complex query
      busiestDay: '', // Would need more complex query
      busiestTime: '', // Would need more complex query
    };
  }

  /**
   * Gets professional availability for a specific date
   */
  async getAvailability(professionalId: string, date: string): Promise<ProfessionalAvailability> {
    // This would need a more complex implementation with availability and booking data
    return {
      date,
      available_slots: [],
      unavailable_slots: [],
    };
  }

  /**
   * Deletes a professional
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('professionals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
