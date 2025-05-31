import { useState, useEffect } from 'react';
import { EfiPayPlanService } from '@/services/payment/efiBank/EfiPayPlanService';
import { SubscriptionPlan } from '@/services/payment/efiBank/types';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';

const efiPayPlanService = new EfiPayPlanService();

export function usePlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { businessId } = useCurrentBusiness();

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedPlans = await efiPayPlanService.getPlans(businessId || undefined);
      setPlans(fetchedPlans);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch plans'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [businessId]);

  const createPlan = async (planData: {
    name: string;
    description?: string;
    price: number;
    interval: 'day' | 'week' | 'month' | 'year';
    interval_count?: number;
    features?: string[];
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      const newPlan = await efiPayPlanService.createPlan(planData, businessId || undefined);
      if (newPlan) {
        setPlans(prev => [newPlan, ...prev]);
      }
      return newPlan;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create plan'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlan = async (planId: string, planData: {
    name?: string;
    description?: string;
    price?: number;
    features?: string[];
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedPlan = await efiPayPlanService.updatePlan(planId, planData);
      if (updatedPlan) {
        setPlans(prev => prev.map(p => p.id === planId ? updatedPlan : p));
      }
      return updatedPlan;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update plan'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deactivatePlan = async (planId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const success = await efiPayPlanService.deactivatePlan(planId);
      if (success) {
        setPlans(prev => prev.map(p => p.id === planId ? { ...p, status: 'inactive' } : p));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to deactivate plan'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    plans,
    isLoading,
    error,
    fetchPlans,
  };
}
