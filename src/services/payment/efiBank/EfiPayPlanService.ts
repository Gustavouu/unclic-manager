
import { supabase } from '@/integrations/supabase/client';
import { EfiPayAuthService } from './EfiPayAuthService';
import { SubscriptionPlan, PlanInterval, PlanStatus } from './types';

export class EfiPayPlanService {
  private authService: EfiPayAuthService;

  constructor() {
    this.authService = EfiPayAuthService.getInstance();
  }

  async createPlan(planData: {
    name: string;
    description: string;
    price: number;
    interval: PlanInterval;
    interval_count: number;
    features: string[];
  }, businessId?: string): Promise<SubscriptionPlan> {
    try {
      // Create plan in EfiPay
      const efiPlan = await this.createEfiPlan(planData);
      
      // Save plan in local database
      const { data, error } = await supabase
        .from('subscription_plans')
        .insert({
          name: planData.name,
          description: planData.description,
          price: planData.price,
          interval: planData.interval as PlanInterval,
          interval_count: planData.interval_count,
          status: 'active' as PlanStatus,
          features: planData.features,
          provider_plan_id: efiPlan.id,
          tenant_id: businessId,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        interval: data.interval as PlanInterval,
        interval_count: data.interval_count,
        status: data.status as PlanStatus,
        features: Array.isArray(data.features) ? data.features as string[] : [],
        provider_plan_id: data.provider_plan_id,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
      };
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      throw error;
    }
  }

  async getPlans(businessId?: string): Promise<SubscriptionPlan[]> {
    try {
      let query = supabase
        .from('subscription_plans')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: true });
      
      if (businessId) {
        query = query.eq('tenant_id', businessId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        interval: plan.interval as PlanInterval,
        interval_count: plan.interval_count,
        status: plan.status as PlanStatus,
        features: Array.isArray(plan.features) ? plan.features as string[] : [],
        provider_plan_id: plan.provider_plan_id,
        created_at: new Date(plan.created_at),
        updated_at: new Date(plan.updated_at),
      }));
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw error;
    }
  }

  async getPlanById(planId: string): Promise<SubscriptionPlan | null> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        interval: data.interval as PlanInterval,
        interval_count: data.interval_count,
        status: data.status as PlanStatus,
        features: Array.isArray(data.features) ? data.features as string[] : [],
        provider_plan_id: data.provider_plan_id,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
      };
    } catch (error) {
      console.error('Error fetching subscription plan:', error);
      throw error;
    }
  }

  async updatePlan(planId: string, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    try {
      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      // Remove created_at if it exists in updates to avoid type errors
      if (updateData.created_at) {
        updateData.created_at = updateData.created_at.toISOString();
      }

      const { data, error } = await supabase
        .from('subscription_plans')
        .update(updateData)
        .eq('id', planId)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        interval: data.interval as PlanInterval,
        interval_count: data.interval_count,
        status: data.status as PlanStatus,
        features: Array.isArray(data.features) ? data.features as string[] : [],
        provider_plan_id: data.provider_plan_id,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
      };
    } catch (error) {
      console.error('Error updating subscription plan:', error);
      throw error;
    }
  }

  async deactivatePlan(planId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('subscription_plans')
        .update({ status: 'inactive' })
        .eq('id', planId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deactivating plan:', error);
      return false;
    }
  }

  private async createEfiPlan(planData: any): Promise<any> {
    // Mock implementation - replace with actual EfiPay API call
    return {
      id: `efi_plan_${Date.now()}`,
      ...planData,
    };
  }
}

export const efiPayPlanService = new EfiPayPlanService();
