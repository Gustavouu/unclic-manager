
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
   * Creates a new business
   */
  async create(data: BusinessCreate): Promise<Business> {
    const { data: business, error } = await supabase
      .from('businesses')
      .insert({
        ...data,
        status: 'active',
        subscription_status: 'trial',
      })
      .select()
      .single();

    if (error) throw error;
    return business;
  }

  /**
   * Updates an existing business
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
   * Gets a business by ID
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
   * Deletes a business
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
