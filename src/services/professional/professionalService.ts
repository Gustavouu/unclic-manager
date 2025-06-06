
import { supabase } from '@/integrations/supabase/client';
import type { Professional, ProfessionalFormData } from '@/types/professional';

export class ProfessionalService {
  private static instance: ProfessionalService;

  private constructor() {}

  public static getInstance(): ProfessionalService {
    if (!ProfessionalService.instance) {
      ProfessionalService.instance = new ProfessionalService();
    }
    return ProfessionalService.instance;
  }

  async create(data: ProfessionalFormData & { business_id: string }): Promise<Professional> {
    const { data: professional, error } = await supabase
      .from('professionals')
      .insert({
        id: crypto.randomUUID(),
        tenantId: data.business_id,
        establishmentId: data.business_id,
        business_id: data.business_id,
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        bio: data.bio || null,
        avatar: data.photo_url || null,
        status: data.status || 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      })
      .select()
      .single();

    if (error) throw error;
    
    // Map the response to include expected field names
    return {
      ...professional,
      business_id: professional.business_id,
      name: professional.name,
      phone: professional.phone,
      position: '', // Not available in current schema
      photo_url: professional.avatar,
      specialties: [], // Not available in current schema
      commission_percentage: 0, // Not available in current schema
      hire_date: null, // Not available in current schema
      created_at: professional.createdAt,
      updated_at: professional.updatedAt,
    };
  }

  async update(id: string, data: Partial<ProfessionalFormData>): Promise<Professional> {
    const updateData: any = {};
    
    if (data.name) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.photo_url !== undefined) updateData.avatar = data.photo_url;
    if (data.status !== undefined) updateData.status = data.status;
    
    updateData.updatedAt = new Date().toISOString();

    const { data: professional, error } = await supabase
      .from('professionals')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Map the response to include expected field names
    return {
      ...professional,
      business_id: professional.business_id,
      name: professional.name,
      phone: professional.phone,
      position: '', // Not available in current schema
      photo_url: professional.avatar,
      specialties: [], // Not available in current schema
      commission_percentage: 0, // Not available in current schema
      hire_date: null, // Not available in current schema
      created_at: professional.createdAt,
      updated_at: professional.updatedAt,
    };
  }

  async getById(id: string): Promise<Professional> {
    const { data: professional, error } = await supabase
      .from('professionals')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    
    // Map the response to include expected field names
    return {
      ...professional,
      business_id: professional.business_id,
      name: professional.name,
      phone: professional.phone,
      position: '', // Not available in current schema
      photo_url: professional.avatar,
      specialties: [], // Not available in current schema
      commission_percentage: 0, // Not available in current schema
      hire_date: null, // Not available in current schema
      created_at: professional.createdAt,
      updated_at: professional.updatedAt,
    };
  }

  async getByBusinessId(businessId: string): Promise<Professional[]> {
    const { data: professionals, error } = await supabase
      .from('professionals')
      .select()
      .eq('business_id', businessId)
      .order('name');

    if (error) throw error;
    
    // Map the response to include expected field names
    return (professionals || []).map(professional => ({
      ...professional,
      business_id: professional.business_id,
      name: professional.name,
      phone: professional.phone,
      position: '', // Not available in current schema
      photo_url: professional.avatar,
      specialties: [], // Not available in current schema
      commission_percentage: 0, // Not available in current schema
      hire_date: null, // Not available in current schema
      created_at: professional.createdAt,
      updated_at: professional.updatedAt,
    }));
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('professionals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async search(params: { business_id: string; search: string }): Promise<Professional[]> {
    const { data: professionals, error } = await supabase
      .from('professionals')
      .select()
      .eq('business_id', params.business_id)
      .or(`name.ilike.%${params.search}%,email.ilike.%${params.search}%`)
      .order('name');

    if (error) throw error;
    
    // Map the response to include expected field names
    return (professionals || []).map(professional => ({
      ...professional,
      business_id: professional.business_id,
      name: professional.name,
      phone: professional.phone,
      position: '', // Not available in current schema
      photo_url: professional.avatar,
      specialties: [], // Not available in current schema
      commission_percentage: 0, // Not available in current schema
      hire_date: null, // Not available in current schema
      created_at: professional.createdAt,
      updated_at: professional.updatedAt,
    }));
  }

  async updateStatus(id: string, status: string): Promise<Professional> {
    return this.update(id, { status });
  }

  async updateRating(id: string, rating: number): Promise<Professional> {
    // For now, return the professional without rating update since it's not in the database schema
    return this.getById(id);
  }

  async getStats(id: string): Promise<any> {
    // Return mock stats for now
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

  async getAvailability(id: string, date: string): Promise<any> {
    // Return mock availability for now
    return {
      date,
      available_slots: [],
      unavailable_slots: [],
    };
  }
}
