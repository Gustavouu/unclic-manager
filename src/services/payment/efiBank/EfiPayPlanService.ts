
import { supabase } from '@/integrations/supabase/client';
import { efiPayAuthService, EfiPayCredentials } from './EfiPayAuthService';
import { v4 as uuidv4 } from 'uuid';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  interval: 'day' | 'week' | 'month' | 'year';
  interval_count: number;
  status: 'active' | 'inactive' | 'archived';
  features?: string[];
  provider_plan_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface CreatePlanParams {
  name: string;
  description?: string;
  price: number;
  interval: 'day' | 'week' | 'month' | 'year';
  interval_count?: number;
  features?: string[];
}

/**
 * Service to manage EFI Pay subscription plans
 */
export class EfiPayPlanService {
  private static instance: EfiPayPlanService;
  private baseUrl: string = '';

  private constructor() {
    // Private constructor to enforce singleton
  }

  public static getInstance(): EfiPayPlanService {
    if (!EfiPayPlanService.instance) {
      EfiPayPlanService.instance = new EfiPayPlanService();
    }
    return EfiPayPlanService.instance;
  }

  private async getBaseUrl(credentials?: EfiPayCredentials): Promise<string> {
    if (this.baseUrl) return this.baseUrl;
    
    const config = credentials || await efiPayAuthService.getBusinessConfiguration();
    if (!config) throw new Error('No EFI Pay configuration found');
    
    this.baseUrl = config.sandbox
      ? 'https://api-pix-h.gerencianet.com.br'
      : 'https://api-pix.gerencianet.com.br';
    
    return this.baseUrl;
  }

  /**
   * Create a new subscription plan in EFI Pay
   */
  public async createPlan(planData: CreatePlanParams, businessId?: string): Promise<SubscriptionPlan | null> {
    try {
      const token = await efiPayAuthService.getToken(businessId);
      if (!token) {
        throw new Error('Failed to get authentication token');
      }

      const baseUrl = await this.getBaseUrl();
      
      // Format the plan data for EFI Pay API
      const efiPayPlanData = {
        name: planData.name,
        interval: planData.interval,
        repeats: planData.interval_count || 1,
        description: planData.description || planData.name
      };

      // Create plan in EFI Pay
      const response = await fetch(`${baseUrl}/v1/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(efiPayPlanData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create plan: ${JSON.stringify(errorData)}`);
      }

      const efiPayResponse = await response.json();
      
      // Store plan in our database
      const { data, error } = await supabase
        .from('subscription_plans')
        .insert({
          id: uuidv4(),
          tenant_id: businessId,
          name: planData.name,
          description: planData.description,
          price: planData.price,
          interval: planData.interval,
          interval_count: planData.interval_count || 1,
          status: 'active',
          features: planData.features ? JSON.stringify(planData.features) : '[]',
          provider_plan_id: efiPayResponse.plan_id
        })
        .select()
        .single();

      if (error) {
        console.error('Error storing plan in database:', error);
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        interval: data.interval,
        interval_count: data.interval_count,
        status: data.status,
        features: data.features,
        provider_plan_id: data.provider_plan_id,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      return null;
    }
  }

  /**
   * Get all subscription plans for a business
   */
  public async getPlans(businessId?: string): Promise<SubscriptionPlan[]> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching plans:', error);
        return [];
      }

      return data.map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        interval: plan.interval,
        interval_count: plan.interval_count,
        status: plan.status,
        features: plan.features,
        provider_plan_id: plan.provider_plan_id,
        created_at: new Date(plan.created_at),
        updated_at: new Date(plan.updated_at)
      }));
    } catch (error) {
      console.error('Error getting subscription plans:', error);
      return [];
    }
  }

  /**
   * Get a specific plan by ID
   */
  public async getPlan(planId: string): Promise<SubscriptionPlan | null> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (error || !data) {
        console.error('Error fetching plan:', error);
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        interval: data.interval,
        interval_count: data.interval_count,
        status: data.status,
        features: data.features,
        provider_plan_id: data.provider_plan_id,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error getting subscription plan:', error);
      return null;
    }
  }

  /**
   * Update an existing subscription plan
   */
  public async updatePlan(
    planId: string, 
    planData: Partial<CreatePlanParams>
  ): Promise<SubscriptionPlan | null> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .update({
          name: planData.name,
          description: planData.description,
          price: planData.price,
          features: planData.features ? JSON.stringify(planData.features) : undefined
        })
        .eq('id', planId)
        .select()
        .single();

      if (error) {
        console.error('Error updating plan:', error);
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        interval: data.interval,
        interval_count: data.interval_count,
        status: data.status,
        features: data.features,
        provider_plan_id: data.provider_plan_id,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error updating subscription plan:', error);
      return null;
    }
  }

  /**
   * Deactivate a subscription plan
   */
  public async deactivatePlan(planId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('subscription_plans')
        .update({ status: 'inactive' })
        .eq('id', planId);

      if (error) {
        console.error('Error deactivating plan:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deactivating subscription plan:', error);
      return false;
    }
  }
}

export const efiPayPlanService = EfiPayPlanService.getInstance();
