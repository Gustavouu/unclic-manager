
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { fetchWithCache } from '@/integrations/supabase/client';

export function useNeedsOnboarding() {
  const { user } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setNeedsOnboarding(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Use the fetchWithCache utility to reduce API calls
        const userData = await fetchWithCache(
          `user-business-${user.id}`,
          async () => {
            const { data, error } = await supabase
              .from('usuarios')
              .select('id_negocio')
              .eq('id', user.id)
              .single();
              
            if (error && error.code !== 'PGRST116') { // Not found error
              throw error;
            }
            
            return data;
          },
          1 // 1 minute cache
        );
        
        // If no business is associated or the user doesn't exist yet, they need onboarding
        if (!userData || !userData.id_negocio) {
          console.log("User needs onboarding - no business associated");
          setNeedsOnboarding(true);
          setLoading(false);
          return;
        }
        
        // Check if the business has completed setup
        const businessData = await fetchWithCache(
          `business-${userData.id_negocio}`,
          async () => {
            const { data, error } = await supabase
              .from('negocios')
              .select('id, status')
              .eq('id', userData.id_negocio)
              .single();
              
            if (error) {
              throw error;
            }
            
            return data;
          },
          1 // 1 minute cache
        );
        
        // If business exists but status is 'pendente', they still need onboarding
        const needsOnboarding = !businessData || businessData.status === 'pendente';
        console.log(`User ${needsOnboarding ? 'needs' : 'does not need'} onboarding - business status: ${businessData?.status}`);
        setNeedsOnboarding(needsOnboarding);
        
      } catch (err: any) {
        console.error('Error checking onboarding status:', err);
        setError(err.message);
        // Default to needing onboarding if there's an error
        setNeedsOnboarding(true);
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user]);

  return { needsOnboarding, loading, error };
}
