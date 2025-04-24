
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

        // Map database fields to our business interface
        if (data) {
          const businessData: BusinessData = {
            id: data.id,
            name: data.nome || data.name,
            description: data.descricao || data.description || '',
            logo: data.url_logo || data.logo,
            banner: data.banner_url || data.banner,
            websiteUrl: data.website_url,
            instagramUrl: data.instagram_url,
            phone: data.telefone || data.phone,
            address: data.endereco || data.address,
            city: data.cidade || data.city,
            state: data.estado || data.state,
            country: data.pais || data.country,
            zipCode: data.cep || data.zip_code,
            ownerId: data.owner_id,
            theme: data.theme,
            currency: data.moeda || data.currency,
            timezone: data.fuso_horario || data.timezone,
            businessType: data.tipo_negocio || data.business_type,
            createdAt: data.criado_em || data.created_at,
            updatedAt: data.atualizado_em || data.updated_at
          };
          setBusinessData(businessData);
        } else {
          setBusinessData(null);
        }
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
