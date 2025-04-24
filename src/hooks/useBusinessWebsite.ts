import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface BusinessData {
  id: string;
  name: string;
  description: string;
  logo?: string;
  banner?: string;
  websiteUrl?: string;
  instagramUrl?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  ownerId?: string;
  theme?: string;
  currency?: string;
  timezone?: string;
  businessType?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useBusinessWebsite = (businessId: string | undefined) => {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!businessId) {
      setIsLoading(false);
      return;
    }

    const fetchBusinessData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', businessId)
          .single();

        if (error) {
          setError(error);
        }

        setBusinessData(data || null);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessData();
  }, [businessId]);

  return { businessData, isLoading, error };
};
