
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

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
        
        // Check if user has a business associated
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('id_negocio')
          .eq('id', user.id)
          .single();
        
        if (userError && userError.code !== 'PGRST116') { // Not found error
          throw userError;
        }
        
        // If no business is associated or the user doesn't exist yet, they need onboarding
        if (!userData || !userData.id_negocio) {
          setNeedsOnboarding(true);
          setLoading(false);
          return;
        }
        
        // Check if the business has completed setup
        const { data: businessData, error: businessError } = await supabase
          .from('negocios')
          .select('id, status')
          .eq('id', userData.id_negocio)
          .single();
          
        if (businessError) {
          throw businessError;
        }
        
        // If business exists but status is 'pendente', they still need onboarding
        setNeedsOnboarding(!businessData || businessData.status === 'pendente');
        
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
