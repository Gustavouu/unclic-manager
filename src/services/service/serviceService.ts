import { supabase } from '@/lib/supabase';
import type {
  Service,
  ServiceCreate,
  ServiceUpdate,
  ServiceStats,
  ServiceSearchParams,
  ServiceCategory,
  ServiceCategoryCreate,
  ServiceCategoryUpdate,
  ServiceCategoryStats,
} from '@/types/service';

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
   * Cria um novo serviço
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
   * Atualiza um serviço existente
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
   * Busca um serviço pelo ID
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
   * Lista serviços com base nos parâmetros de busca
   */
  async search(params: ServiceSearchParams): Promise<Service[]> {
    let query = supabase
      .from('services')
      .select()
      .eq('business_id', params.business_id);

    if (params.category) {
      query = query.eq('category', params.category);
    }

    if (params.min_price) {
      query = query.gte('price', params.min_price);
    }

    if (params.max_price) {
      query = query.lte('price', params.max_price);
    }

    if (params.min_duration) {
      query = query.gte('duration', params.min_duration);
    }

    if (params.max_duration) {
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
    return services;
  }

  /**
   * Deleta um serviço
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Atualiza o status de ativação do serviço
   */
  async updateStatus(id: string, isActive: boolean): Promise<Service> {
    const { data: service, error } = await supabase
      .from('services')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return service;
  }

  /**
   * Busca estatísticas do serviço
   */
  async getStats(serviceId: string): Promise<ServiceStats> {
    const { data, error } = await supabase.rpc('get_service_stats', {
      service_id: serviceId,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Cria uma nova categoria de serviço
   */
  async createCategory(data: ServiceCategoryCreate): Promise<ServiceCategory> {
    const { data: category, error } = await supabase
      .from('service_categories')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return category;
  }

  /**
   * Atualiza uma categoria de serviço existente
   */
  async updateCategory(
    id: string,
    data: ServiceCategoryUpdate
  ): Promise<ServiceCategory> {
    const { data: category, error } = await supabase
      .from('service_categories')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return category;
  }

  /**
   * Busca uma categoria de serviço pelo ID
   */
  async getCategoryById(id: string): Promise<ServiceCategory> {
    const { data: category, error } = await supabase
      .from('service_categories')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return category;
  }

  /**
   * Lista categorias de serviço de um negócio
   */
  async listCategories(businessId: string): Promise<ServiceCategory[]> {
    const { data: categories, error } = await supabase
      .from('service_categories')
      .select()
      .eq('business_id', businessId);

    if (error) throw error;
    return categories;
  }

  /**
   * Deleta uma categoria de serviço
   */
  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('service_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Busca estatísticas de uma categoria de serviço
   */
  async getCategoryStats(categoryId: string): Promise<ServiceCategoryStats> {
    const { data, error } = await supabase.rpc('get_service_category_stats', {
      category_id: categoryId,
    });

    if (error) throw error;
    return data;
  }
} 