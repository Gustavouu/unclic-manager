
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBusinessWebsite = (slug: string) => {
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBusinessData() {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch business details
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('*')
          .eq('slug', slug)
          .single();

        if (businessError) throw businessError;
        if (!businessData) throw new Error('Business not found');

        setBusiness(businessData);

        // Fetch services for this business
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .eq('business_id', businessData.id)
          .eq('is_active', true)
          .order('price');

        if (servicesError) throw servicesError;
        setServices(servicesData || []);

        // Fetch staff/professionals for this business
        const { data: staffData, error: staffError } = await supabase
          .from('professionals')
          .select('*')
          .eq('business_id', businessData.id)
          .eq('status', 'active');

        if (staffError) throw staffError;
        
        // Add position as role for backward compatibility
        const staffWithRole = staffData?.map(person => ({
          ...person,
          role: person.position // Use position as role
        })) || [];
        
        setStaff(staffWithRole);

      } catch (error: any) {
        console.error('Error fetching business website data:', error);
        setError(error.message);
        toast.error('Error loading business information');
      } finally {
        setLoading(false);
      }
    }

    fetchBusinessData();
  }, [slug]);

  return { business, services, staff, loading, error };
};
