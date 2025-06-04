
import { useState, useEffect } from 'react';
import { useOptimizedTenant } from '@/contexts/OptimizedTenantContext';
import { useAuth } from '@/hooks/useAuth';

export const useNeedsOnboarding = () => {
  const { user } = useAuth();
  const { businessId, currentBusiness, isLoading: tenantLoading } = useOptimizedTenant();
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkOnboardingStatus = () => {
      if (!user) {
        setNeedsOnboarding(false);
        setLoading(false);
        return;
      }

      // Wait for tenant loading to complete
      if (tenantLoading) {
        return;
      }

      try {
        setError(null);
        // If no business is found, user needs onboarding
        if (!businessId || !currentBusiness?.name) {
          setNeedsOnboarding(true);
        } else {
          setNeedsOnboarding(false);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
        setNeedsOnboarding(true);
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user, businessId, currentBusiness, tenantLoading]);

  return {
    needsOnboarding,
    loading,
    error,
  };
};
