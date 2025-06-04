
import { useState, useEffect } from 'react';
import { useOptimizedTenant } from '@/contexts/OptimizedTenantContext';
import { useAuth } from '@/contexts/AuthContext';

export const useNeedsOnboarding = () => {
  const { user } = useAuth();
  const { businessId, currentBusiness } = useOptimizedTenant();
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setNeedsOnboarding(false);
        setLoading(false);
        return;
      }

      try {
        // If no business is found, user needs onboarding
        if (!businessId || !currentBusiness?.name) {
          setNeedsOnboarding(true);
        } else {
          setNeedsOnboarding(false);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
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
  };
};
