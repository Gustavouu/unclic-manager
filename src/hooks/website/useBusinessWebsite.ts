
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface BusinessData {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  instagram_url?: string;
  phone?: string;
  address?: string;
  address_number?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  admin_email?: string;
  neighborhood?: string;
  owner_id?: string;
  theme?: string;
  currency?: string;
  timezone?: string;
  business_type?: string;
  working_hours?: any;
  created_at?: string;
  updated_at?: string;
}

export interface SimpleStaff {
  id: string;
  name: string;
  bio?: string;
  photo_url?: string;
  business_id: string;
  specialties?: string[];
}

export const useBusinessWebsite = (businessId?: string) => {
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [staff, setStaff] = useState<SimpleStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    const fetchBusinessData = async () => {
      setLoading(true);
      try {
        // Fetch staff from professionals table if it exists
        const { data: professionalsData, error: professionalsError } = await supabase
          .from('professionals')
          .select('*')
          .eq('business_id', businessId);
          
        let staffInfo: SimpleStaff[] = [];
        if (!professionalsError && professionalsData?.length) {
          staffInfo = professionalsData.map((staff: any) => ({
            id: staff.id,
            name: staff.name,
            bio: staff.bio,
            photo_url: staff.photo_url,
            business_id: staff.business_id,
            specialties: staff.specialties || []
          }));
        }

        setStaff(staffInfo);
      } catch (err: any) {
        console.error("Error loading website data:", err);
        setError(err.message || 'Error loading data');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [businessId]);

  return {
    business,
    staff,
    loading,
    error
  };
};
