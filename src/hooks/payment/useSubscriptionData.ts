
import { supabase } from '@/integrations/supabase/client';

// Interfaces for subscription data
export interface SubscriptionPlan {
  price: number;
  interval: string;
  interval_count: number;
}

export interface SubscriptionWithPlan {
  id: string;
  plan_id: string;
  subscription_plans: SubscriptionPlan | SubscriptionPlan[] | null;
}

/**
 * Calculate monthly recurring revenue (MRR) from subscription data
 */
export function calculateMonthlyRecurringRevenue(subscriptions: SubscriptionWithPlan[]): number {
  let mrr = 0;

  for (const sub of subscriptions) {
    const planData = sub.subscription_plans;
    if (!planData) continue;
    
    // Extract plan details
    let price = 0;
    let interval = 'month';
    let intervalCount = 1;
    
    if (Array.isArray(planData) && planData.length > 0) {
      price = Number(planData[0].price || 0);
      interval = String(planData[0].interval || 'month');
      intervalCount = Number(planData[0].interval_count || 1);
    } else {
      const planObj = planData as unknown as SubscriptionPlan;
      price = Number(planObj.price || 0);
      interval = String(planObj.interval || 'month');
      intervalCount = Number(planObj.interval_count || 1);
    }
    
    // Normalize to monthly revenue
    switch (interval) {
      case 'day':
        mrr += (price * 30) / intervalCount;
        break;
      case 'week':
        mrr += (price * 4) / intervalCount;
        break;
      case 'month':
        mrr += price / intervalCount;
        break;
      case 'year':
        mrr += price / (12 * intervalCount);
        break;
    }
  }
  
  return mrr;
}

/**
 * Fetch active subscriptions with their plan details
 */
export async function fetchActiveSubscriptionsWithPlans(): Promise<SubscriptionWithPlan[]> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      id,
      plan_id,
      subscription_plans(price, interval, interval_count)
    `)
    .in('status', ['active', 'trialing']);
  
  if (error) {
    throw new Error(`Failed to fetch active subscriptions with plans: ${error.message}`);
  }
  
  return data as unknown as SubscriptionWithPlan[];
}
