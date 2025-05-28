import { supabase } from '@/lib/supabase';
import type { Business, BusinessCreate, BusinessUpdate } from '@/types/business';

export class BusinessService {
  private static instance: BusinessService;

  private constructor() {}

  public static getInstance(): BusinessService {
    if (!BusinessService.instance) {
      BusinessService.instance = new BusinessService();
    }
    return BusinessService.instance;
  }

  /**
   * Cria um novo negócio
   */
  async create(data: BusinessCreate): Promise<Business> {
    const { data: business, error } = await supabase
      .from('businesses')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return business;
  }

  /**
   * Atualiza um negócio existente
   */
  async update(id: string, data: BusinessUpdate): Promise<Business> {
    const { data: business, error } = await supabase
      .from('businesses')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return business;
  }

  /**
   * Busca um negócio pelo ID
   */
  async getById(id: string): Promise<Business> {
    const { data: business, error } = await supabase
      .from('businesses')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return business;
  }

  /**
   * Lista todos os negócios do usuário
   */
  async listByUser(userId: string): Promise<Business[]> {
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select()
      .eq('user_id', userId);

    if (error) throw error;
    return businesses;
  }

  /**
   * Deleta um negócio
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Verifica se o usuário tem acesso ao negócio
   */
  async checkAccess(businessId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('business_users')
      .select('id')
      .eq('business_id', businessId)
      .eq('user_id', userId)
      .single();

    if (error) return false;
    return !!data;
  }

  /**
   * Atualiza o status de assinatura do negócio
   */
  async updateSubscriptionStatus(
    businessId: string,
    status: 'trial' | 'active' | 'suspended' | 'cancelled'
  ): Promise<Business> {
    const { data: business, error } = await supabase
      .from('businesses')
      .update({ subscription_status: status })
      .eq('id', businessId)
      .select()
      .single();

    if (error) throw error;
    return business;
  }

  /**
   * Atualiza as configurações do negócio
   */
  async updateSettings(
    businessId: string,
    settings: Partial<Business['settings']>
  ): Promise<Business> {
    const { data: business, error } = await supabase
      .from('businesses')
      .update({ settings })
      .eq('id', businessId)
      .select()
      .single();

    if (error) throw error;
    return business;
  }

  /**
   * Busca estatísticas do negócio
   */
  async getStats(businessId: string): Promise<{
    totalClients: number;
    totalAppointments: number;
    totalRevenue: number;
    activeProfessionals: number;
  }> {
    const { data, error } = await supabase.rpc('get_business_stats', {
      business_id: businessId,
    });

    if (error) throw error;
    return data;
  }
} 