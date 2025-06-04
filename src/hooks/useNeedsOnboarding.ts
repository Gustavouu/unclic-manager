
import { useState, useEffect } from 'react';
import { useOptimizedTenant } from '@/contexts/OptimizedTenantContext';
import { useAuth } from '@/contexts/AuthContext';

export const useNeedsOnboarding = () => {
  const { user } = useAuth();
  const { businessId, currentBusiness } = useOptimizedTenant();
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setNeedsOnboarding(false);
        setLoading(false);
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
  }, [user, businessId, currentBusiness]);

  return {
    needsOnboarding,
    loading,
    error,
  };
};
