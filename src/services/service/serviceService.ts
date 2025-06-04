
import { supabase } from '@/integrations/supabase/client';
import type { Service, ServiceFormData } from '@/types/service';

export class ServiceService {
  private static instance: ServiceService;

  private constructor() {}

  public static getInstance(): ServiceService {
    if (!ServiceService.instance) {
      ServiceService.instance = new ServiceService();
    }
    return ServiceService.instance;
  }

  async create(data: ServiceFormData & { business_id: string }): Promise<Service> {
    const { data: service, error } = await supabase
      .from('services')
      .insert({
        business_id: data.business_id,
        nome: data.name,
        descricao: data.description || null,
        duracao: data.duration,
        preco: data.price,
        categoria: data.category || 'Geral',
        ativo: true,
      })
      .select()
      .single();

    if (error) throw error;
    return service;
  }

  async update(id: string, data: Partial<ServiceFormData>): Promise<Service> {
    const updateData: any = {};
    
    if (data.name) updateData.nome = data.name;
    if (data.description !== undefined) updateData.descricao = data.description;
    if (data.duration) updateData.duracao = data.duration;
    if (data.price !== undefined) updateData.preco = data.price;
    if (data.category) updateData.categoria = data.category;
    
    updateData.atualizado_em = new Date().toISOString();

    const { data: service, error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return service;
  }

  async getById(id: string): Promise<Service> {
    const { data: service, error } = await supabase
      .from('services')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return service;
  }

  async getByBusinessId(businessId: string): Promise<Service[]> {
    const { data: services, error } = await supabase
      .from('services')
      .select()
      .eq('business_id', businessId)
      .eq('ativo', true)
      .order('nome');

    if (error) throw error;
    return services || [];
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
