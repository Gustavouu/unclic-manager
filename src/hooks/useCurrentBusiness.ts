
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface BusinessData {
  id: string;
  name: string;
  status: string;
  logo_url?: string;
  address?: string;
  phone?: string;
  admin_email?: string;
  // Add any other business fields as needed
}

export function useCurrentBusiness() {
  const [businessId, setBusinessId] = useState<string | null>(localStorage.getItem('currentBusinessId'));
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchBusinessId = async () => {
      if (!user) {
        setBusinessId(null);
        setLoading(false);
        return;
      }

      try {
        // Check if we have a business ID in localStorage
        const storedBusinessId = localStorage.getItem('currentBusinessId');
        
        if (storedBusinessId) {
          setBusinessId(storedBusinessId);
        } else {
          // If not, fetch the user's first business
          const { data, error } = await supabase
            .from('business_users')
            .select('business_id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
          if (error && error.code !== 'PGRST116') {
            // PGRST116 is "no rows returned" - not an error for us
            throw error;
          }
          
          if (data?.business_id) {
            localStorage.setItem('currentBusinessId', data.business_id);
            setBusinessId(data.business_id);
          }
        }
      } catch (err: any) {
        console.error("Error fetching business ID:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchBusinessId();
    } else {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  // Fetch business data when businessId changes
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!businessId) {
        setBusinessData(null);
        return;
      }

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', businessId)
          .single();
          
        if (error) throw error;
        
        setBusinessData(data);
      } catch (err: any) {
        console.error("Error fetching business data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [businessId]);

  return {
    businessId,
    businessData,
    loading,
    error,
    setBusinessId: (id: string) => {
      localStorage.setItem('currentBusinessId', id);
      setBusinessId(id);
    }
  };
}
