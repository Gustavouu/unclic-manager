
import { useState, useEffect } from 'react';
import { efiPaySubscriptionService, Subscription } from '@/services/payment/efiBank/EfiPaySubscriptionService';

export function useSubscriptions(customerId?: string) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubscriptions = async (id?: string) => {
    const custId = id || customerId;
    if (!custId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const fetchedSubscriptions = await efiPaySubscriptionService.getCustomerSubscriptions(custId);
      setSubscriptions(fetchedSubscriptions);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch subscriptions'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchSubscriptions();
    }
  }, [customerId]);

  const createSubscription = async (data: {
    customer_id: string;
    plan_id: string;
    payment_method?: string;
    metadata?: Record<string, any>;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      const newSubscription = await efiPaySubscriptionService.createSubscription(data);
      if (newSubscription) {
        setSubscriptions(prev => [newSubscription, ...prev]);
      }
      return newSubscription;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create subscription'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async (subscriptionId: string, cancelAtPeriodEnd: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const success = await efiPaySubscriptionService.cancelSubscription(subscriptionId, cancelAtPeriodEnd);
      if (success) {
        setSubscriptions(prev => 
          prev.map(sub => 
            sub.id === subscriptionId 
              ? { 
                  ...sub, 
                  status: 'canceled',
                  cancel_at_period_end: cancelAtPeriodEnd,
                  canceled_at: cancelAtPeriodEnd ? undefined : new Date() 
                } 
              : sub
          )
        );
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to cancel subscription'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    subscriptions,
    isLoading,
    error,
    fetchSubscriptions,
    createSubscription,
    cancelSubscription,
  };
}
