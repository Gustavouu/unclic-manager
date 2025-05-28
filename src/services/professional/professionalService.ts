import { supabase } from '@/lib/supabase';
import type {
  Professional,
  ProfessionalCreate,
  ProfessionalUpdate,
  ProfessionalStats,
  ProfessionalSearchParams,
  ProfessionalAvailability,
  TimeSlot,
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
   * Cria um novo profissional
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
   * Atualiza um profissional existente
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
   * Busca um profissional pelo ID
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
   * Lista profissionais com base nos parâmetros de busca
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

    if (params.rating) {
      query = query.gte('rating', params.rating);
    }

    if (params.search) {
      query = query.or(`name.ilike.%${params.search}%,email.ilike.%${params.search}%`);
    }

    const { data: professionals, error } = await query;

    if (error) throw error;
    return professionals;
  }

  /**
   * Deleta um profissional
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('professionals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Atualiza o status do profissional
   */
  async updateStatus(
    id: string,
    status: 'active' | 'inactive' | 'on_leave'
  ): Promise<Professional> {
    const { data: professional, error } = await supabase
      .from('professionals')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return professional;
  }

  /**
   * Atualiza a avaliação do profissional
   */
  async updateRating(
    id: string,
    rating: number,
    incrementReviews: boolean = true
  ): Promise<Professional> {
    const professional = await this.getById(id);
    const newTotalReviews = incrementReviews ? professional.total_reviews + 1 : professional.total_reviews;
    const newRating = ((professional.rating * professional.total_reviews) + rating) / newTotalReviews;

    const { data: updatedProfessional, error } = await supabase
      .from('professionals')
      .update({
        rating: newRating,
        total_reviews: newTotalReviews,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updatedProfessional;
  }

  /**
   * Busca estatísticas do profissional
   */
  async getStats(professionalId: string): Promise<ProfessionalStats> {
    const { data, error } = await supabase.rpc('get_professional_stats', {
      professional_id: professionalId,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Verifica a disponibilidade do profissional em uma data específica
   */
  async getAvailability(
    professionalId: string,
    date: string
  ): Promise<ProfessionalAvailability> {
    const professional = await this.getById(professionalId);
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const workingHours = professional.working_hours[dayOfWeek as keyof typeof professional.working_hours];

    // Busca agendamentos existentes para a data
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('start_time, end_time')
      .eq('professional_id', professionalId)
      .eq('status', 'scheduled')
      .gte('start_time', `${date}T00:00:00Z`)
      .lt('start_time', `${date}T23:59:59Z`);

    if (error) throw error;

    // Converte horários de trabalho em slots disponíveis
    const availableSlots: TimeSlot[] = [...workingHours];
    const unavailableSlots: TimeSlot[] = [];

    // Remove slots ocupados por agendamentos
    appointments.forEach(appointment => {
      const appointmentStart = new Date(appointment.start_time);
      const appointmentEnd = new Date(appointment.end_time);

      availableSlots.forEach((slot, index) => {
        const slotStart = new Date(`${date}T${slot.start}:00Z`);
        const slotEnd = new Date(`${date}T${slot.end}:00Z`);

        if (
          (slotStart <= appointmentStart && slotEnd > appointmentStart) ||
          (slotStart < appointmentEnd && slotEnd >= appointmentEnd) ||
          (slotStart >= appointmentStart && slotEnd <= appointmentEnd)
        ) {
          unavailableSlots.push(slot);
          availableSlots.splice(index, 1);
        }
      });
    });

    return {
      date,
      available_slots: availableSlots,
      unavailable_slots: unavailableSlots,
    };
  }
} 