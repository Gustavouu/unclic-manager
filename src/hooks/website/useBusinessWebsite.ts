
import { useState, useEffect } from 'react';

interface BusinessWebsite {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo_url?: string;
  banner_url?: string;
  primary_color: string;
  secondary_color: string;
  allow_online_booking: boolean;
}

export const useBusinessWebsite = (slug?: string) => {
  const [website, setWebsite] = useState<BusinessWebsite | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWebsite = async () => {
    if (!slug) {
      setWebsite(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Mock data for now to avoid database complexities
      const mockWebsite: BusinessWebsite = {
        id: '1',
        slug: slug,
        name: 'Business Demo',
        description: 'Demo business website',
        logo_url: null,
        banner_url: null,
        primary_color: '#213858',
        secondary_color: '#33c3f0',
        allow_online_booking: true
      };

      setWebsite(mockWebsite);
    } catch (err) {
      console.error('Error fetching business website:', err);
      setError(err as Error);
      setWebsite(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsite();
  }, [slug]);

  return {
    website,
    isLoading,
    error,
    refetch: fetchWebsite
  };
};
