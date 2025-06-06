import { supabase } from '@/integrations/supabase/client';
import type { Service, ServiceFormData, ServiceSearchParams, ServiceStats } from '@/types/service';

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
    console.log('Creating service:', data);
    
    const { data: service, error } = await supabase
      .from('services')
      .insert({
        business_id: data.business_id,
        id_negocio: data.business_id,
        name: data.name,
        nome: data.name,
        description: data.description || null,
        descricao: data.description || null,
        duration: data.duration,
        duracao: data.duration,
        price: data.price,
        preco: data.price,
        category: data.category || 'Geral',
        categoria: data.category || 'Geral',
        image_url: data.image_url || null,
        commission_percentage: data.commission_percentage || 0,
        is_active: true,
        ativo: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating service:', error);
      throw new Error(`Erro ao criar serviço: ${error.message}`);
    }
    
    return this.mapServiceFromDb(service);
  }

  async update(id: string, data: Partial<ServiceFormData>): Promise<Service> {
    console.log('Updating service:', id, data);
    
    const updateData: any = {};
    
    if (data.name !== undefined) {
      updateData.name = data.name;
      updateData.nome = data.name;
    }
    if (data.description !== undefined) {
      updateData.description = data.description;
      updateData.descricao = data.description;
    }
    if (data.duration !== undefined) {
      updateData.duration = data.duration;
      updateData.duracao = data.duration;
    }
    if (data.price !== undefined) {
      updateData.price = data.price;
      updateData.preco = data.price;
    }
    if (data.category !== undefined) {
      updateData.category = data.category;
      updateData.categoria = data.category;
    }
    if (data.image_url !== undefined) {
      updateData.image_url = data.image_url;
    }
    if (data.commission_percentage !== undefined) {
      updateData.commission_percentage = data.commission_percentage;
    }
    
    updateData.updated_at = new Date().toISOString();
    updateData.atualizado_em = new Date().toISOString();

    const { data: service, error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating service:', error);
      throw new Error(`Erro ao atualizar serviço: ${error.message}`);
    }
    
    return this.mapServiceFromDb(service);
  }

  async getById(id: string): Promise<Service> {
    console.log('Getting service by id:', id);
    
    const { data: service, error } = await supabase
      .from('services')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error getting service:', error);
      throw new Error(`Erro ao buscar serviço: ${error.message}`);
    }
    
    return this.mapServiceFromDb(service);
  }

  async getByBusinessId(businessId: string): Promise<Service[]> {
    console.log('Getting services by business id:', businessId);
    
    const { data: services, error } = await supabase
      .from('services')
      .select()
      .or(`business_id.eq.${businessId},id_negocio.eq.${businessId}`)
      .order('name');

    if (error) {
      console.error('Error getting services:', error);
      throw new Error(`Erro ao buscar serviços: ${error.message}`);
    }
    
    return (services || []).map(service => this.mapServiceFromDb(service));
  }

  async search(params: ServiceSearchParams): Promise<Service[]> {
    console.log('Searching services with params:', params);
    
    let query = supabase
      .from('services')
      .select()
      .or(`business_id.eq.${params.business_id},id_negocio.eq.${params.business_id}`);

    if (params.search) {
      query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%,category.ilike.%${params.search}%,nome.ilike.%${params.search}%,descricao.ilike.%${params.search}%`);
    }

    if (params.category) {
      query = query.eq('category', params.category);
    }

    if (params.is_active !== undefined) {
      query = query.eq('is_active', params.is_active);
    }

    query = query.order('name');

    const { data: services, error } = await query;

    if (error) {
      console.error('Error searching services:', error);
      throw new Error(`Erro ao pesquisar serviços: ${error.message}`);
    }
    
    return (services || []).map(service => this.mapServiceFromDb(service));
  }

  async delete(id: string): Promise<void> {
    console.log('Deleting service:', id);
    
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting service:', error);
      throw new Error(`Erro ao excluir serviço: ${error.message}`);
    }
  }

  async updateStatus(id: string, isActive: boolean): Promise<Service> {
    console.log('Updating service status:', id, isActive);
    
    const { data: service, error } = await supabase
      .from('services')
      .update({ 
        is_active: isActive, 
        ativo: isActive,
        updated_at: new Date().toISOString(),
        atualizado_em: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating service status:', error);
      throw new Error(`Erro ao atualizar status do serviço: ${error.message}`);
    }
    
    return this.mapServiceFromDb(service);
  }

  async getStats(id: string): Promise<ServiceStats> {
    console.log('Getting service stats for:', id);
    
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

  async getCategories(businessId: string): Promise<string[]> {
    console.log('Getting service categories for business:', businessId);
    
    const { data: services, error } = await supabase
      .from('services')
      .select('category')
      .or(`business_id.eq.${businessId},id_negocio.eq.${businessId}`)
      .eq('is_active', true);

    if (error) {
      console.error('Error getting service categories:', error);
      return ['Geral'];
    }

    const categories = [...new Set((services || []).map(s => s.category).filter(Boolean))];
    return categories.length > 0 ? categories : ['Geral'];
  }

  private mapServiceFromDb(service: any): Service {
    return {
      ...service,
      business_id: service.business_id || service.id_negocio,
      id_negocio: service.id_negocio || service.business_id,
      name: service.name || service.nome,
      nome: service.nome || service.name,
      description: service.description || service.descricao,
      descricao: service.descricao || service.description,
      duration: service.duration || service.duracao,
      duracao: service.duracao || service.duration,
      price: service.price || service.preco,
      preco: service.preco || service.price,
      category: service.category || service.categoria || 'Geral',
      categoria: service.categoria || service.category || 'Geral',
      is_active: service.is_active ?? service.ativo ?? true,
      ativo: service.ativo ?? service.is_active ?? true,
      image_url: service.image_url,
      commission_percentage: service.commission_percentage || 0,
      created_at: service.created_at || service.criado_em,
      criado_em: service.criado_em || service.created_at,
      updated_at: service.updated_at || service.atualizado_em,
      atualizado_em: service.atualizado_em || service.updated_at,
    };
  }
}
