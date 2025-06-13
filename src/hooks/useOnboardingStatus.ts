
import { useState, useEffect } from 'react';
import { useMultiTenant } from '@/contexts/MultiTenantContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface OnboardingStatus {
  needsOnboarding: boolean;
  isLoading: boolean;
  error: string | null;
  businessId: string | null;
  onboardingComplete: boolean;
  missingSteps: string[];
}

export const useOnboardingStatus = () => {
  const { user } = useAuth();
  const { currentBusiness, isLoading: businessLoading } = useMultiTenant();
  const [status, setStatus] = useState<OnboardingStatus>({
    needsOnboarding: false,
    isLoading: true,
    error: null,
    businessId: null,
    onboardingComplete: false,
    missingSteps: [],
  });

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user || businessLoading) {
        setStatus(prev => ({ ...prev, isLoading: true }));
        return;
      }

      try {
        setStatus(prev => ({ ...prev, isLoading: true, error: null }));

        // If no business is found, user needs onboarding
        if (!currentBusiness) {
          setStatus({
            needsOnboarding: true,
            isLoading: false,
            error: null,
            businessId: null,
            onboardingComplete: false,
            missingSteps: ['business_creation'],
          });
          return;
        }

        // Check if business status indicates incomplete onboarding
        if (currentBusiness.status === 'trial' || currentBusiness.status === 'inactive') {
          setStatus({
            needsOnboarding: true,
            isLoading: false,
            error: null,
            businessId: currentBusiness.id,
            onboardingComplete: false,
            missingSteps: ['business_setup'],
          });
          return;
        }

        // Call the verificar_completar_onboarding function to check detailed status
        const { data, error } = await supabase.rpc('verificar_completar_onboarding', {
          business_id_param: currentBusiness.id
        });

        if (error) {
          console.error('Error checking onboarding status:', error);
          setStatus({
            needsOnboarding: false,
            isLoading: false,
            error: error.message,
            businessId: currentBusiness.id,
            onboardingComplete: true, // Assume complete on error to avoid blocking
            missingSteps: [],
          });
          return;
        }

        const result = typeof data === 'string' ? JSON.parse(data) : data;
        
        setStatus({
          needsOnboarding: !result.onboarding_complete,
          isLoading: false,
          error: null,
          businessId: currentBusiness.id,
          onboardingComplete: result.onboarding_complete || false,
          missingSteps: result.missing_steps || [],
        });

      } catch (error) {
        console.error('Error in onboarding status check:', error);
        setStatus({
          needsOnboarding: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          businessId: currentBusiness?.id || null,
          onboardingComplete: true, // Assume complete on error
          missingSteps: [],
        });
      }
    };

    checkOnboardingStatus();
  }, [user, currentBusiness, businessLoading]);

  const refreshStatus = () => {
    if (user && !businessLoading) {
      setStatus(prev => ({ ...prev, isLoading: true }));
      // Trigger re-check by updating a dependency
    }
  };

  return {
    ...status,
    refreshStatus,
  };
};
