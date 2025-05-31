
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface BusinessData {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
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

export interface SimpleService {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  business_id: string;
  is_active: boolean;
}

export interface SimpleStaff {
  id: string;
  name: string;
  position?: string;
  photo_url?: string;
  business_id: string;
  specialties?: string[];
  role?: string;
}

export const useBusinessWebsite = (businessId?: string) => {
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [services, setServices] = useState<SimpleService[]>([]);
  const [staff, setStaff] = useState<SimpleStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    const fetchBusinessData = async () => {
      setLoading(true);
      try {
        // First try fetching from businesses table
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', businessId)
          .maybeSingle();

        if (businessError && businessError.code !== '42P01') {
          console.error("Error fetching business:", businessError);
        }
        
        let businessInfo = businessData;
        
        // If not found, try legacy negocios table
        if (!businessInfo) {
          try {
            const { data: legacyData, error: legacyError } = await supabase
              .from('negocios')
              .select('*')
              .eq('id', businessId)
              .maybeSingle();
              
            if (legacyError && legacyError.code !== '42P01') {
              console.error("Error fetching from legacy table:", legacyError);
            }
            
            if (legacyData) {
              // Map legacy data to new format with all required properties
              businessInfo = {
                id: legacyData.id,
                name: legacyData.nome,
                description: legacyData.descricao,
                logo_url: legacyData.url_logo,
                phone: legacyData.telefone,
                address: legacyData.endereco,
                address_number: legacyData.numero,
                city: legacyData.cidade,
                state: legacyData.estado,
                zip_code: legacyData.cep,
                admin_email: legacyData.email_admin,
                neighborhood: legacyData.bairro,
                // Add missing required properties with defaults
                country: 'BR',
                owner_id: '',
                theme: 'default',
                currency: 'BRL',
                timezone: 'America/Sao_Paulo',
                business_type: 'salon',
                working_hours: {},
                created_at: legacyData.criado_em || new Date().toISOString(),
                updated_at: legacyData.atualizado_em || new Date().toISOString()
              };
            }
          } catch (err) {
            console.error("Error in legacy business fetch:", err);
          }
        }

        // Fetch services from servicos table
        const { data: legacyServices, error: legacyServicesError } = await supabase
          .from('servicos')
          .select('*')
          .eq('id_negocio', businessId)
          .eq('ativo', true);
          
        let servicesInfo: SimpleService[] = [];
        if (!legacyServicesError && legacyServices?.length) {
          // Map legacy data to simple format
          servicesInfo = legacyServices.map((service: any) => ({
            id: service.id,
            name: service.nome,
            description: service.descricao,
            price: service.preco,
            duration: service.duracao,
            business_id: service.id_negocio,
            is_active: service.ativo
          }));
        }
        
        // Fetch staff from funcionarios table
        const { data: legacyStaff, error: legacyStaffError } = await supabase
          .from('funcionarios')
          .select('*')
          .eq('id_negocio', businessId)
          .eq('status', 'ativo');
          
        let staffInfo: SimpleStaff[] = [];
        if (!legacyStaffError && legacyStaff?.length) {
          // Map legacy data to simple format
          staffInfo = legacyStaff.map((staff: any) => ({
            id: staff.id,
            name: staff.nome,
            position: staff.cargo,
            photo_url: staff.foto_url,
            business_id: staff.id_negocio,
            specialties: staff.especializacoes || [],
            role: staff.cargo || 'staff'
          }));
        }

        // Update state with all data
        setBusiness(businessInfo || null);
        setServices(servicesInfo);
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

  // Booking flow handlers
  const startBooking = useCallback(() => {
    setIsBookingOpen(true);
  }, []);
  
  const closeBooking = useCallback(() => {
    setIsBookingOpen(false);
  }, []);
  
  // Business validation function
  const checkIsCorrectBusiness = useCallback((id?: string) => {
    // In development always return true
    if (process.env.NODE_ENV === 'development') return true;
    
    // In production do proper validation
    return !!business && !!id && business.id === id;
  }, [business]);

  return {
    business,
    services,
    staff,
    loading,
    error,
    isBookingOpen,
    startBooking,
    closeBooking,
    checkIsCorrectBusiness
  };
};
