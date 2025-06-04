
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
      .from('funcionarios')
      .insert({
        id_negocio: data.business_id,
        nome: data.name,
        email: data.email || null,
        telefone: data.phone || null,
        cargo: data.position || null,
        bio: data.bio || null,
        foto_url: data.photo_url || null,
        especializacoes: data.specialties || [],
        comissao_percentual: data.commission_percentage || 0,
        data_contratacao: data.hire_date || null,
        status: data.status || 'ativo',
      })
      .select()
      .single();

    if (error) throw error;
    return professional;
  }

  async update(id: string, data: Partial<ProfessionalFormData>): Promise<Professional> {
    const updateData: any = {};
    
    if (data.name) updateData.nome = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.telefone = data.phone;
    if (data.position !== undefined) updateData.cargo = data.position;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.photo_url !== undefined) updateData.foto_url = data.photo_url;
    if (data.specialties !== undefined) updateData.especializacoes = data.specialties;
    if (data.commission_percentage !== undefined) updateData.comissao_percentual = data.commission_percentage;
    if (data.hire_date !== undefined) updateData.data_contratacao = data.hire_date;
    if (data.status !== undefined) updateData.status = data.status;
    
    updateData.atualizado_em = new Date().toISOString();

    const { data: professional, error } = await supabase
      .from('funcionarios')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return professional;
  }

  async getById(id: string): Promise<Professional> {
    const { data: professional, error } = await supabase
      .from('funcionarios')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return professional;
  }

  async getByBusinessId(businessId: string): Promise<Professional[]> {
    const { data: professionals, error } = await supabase
      .from('funcionarios')
      .select()
      .eq('id_negocio', businessId)
      .eq('status', 'ativo')
      .order('nome');

    if (error) throw error;
    return professionals || [];
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('funcionarios')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
