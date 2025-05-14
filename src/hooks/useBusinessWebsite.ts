
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface BusinessData {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
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

export const useBusinessWebsite = (businessId?: string) => {
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
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
              // Map legacy data to new format
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
                neighborhood: legacyData.bairro
              };
            }
          } catch (err) {
            console.error("Error in legacy business fetch:", err);
          }
        }

        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .eq('business_id', businessId)
          .eq('is_active', true);
          
        if (servicesError && servicesError.code !== '42P01') {
          console.error("Error fetching services:", servicesError);
        }
        
        let servicesInfo = servicesData || [];
        
        // If no services found, try legacy table
        if (!servicesInfo.length) {
          try {
            const { data: legacyServices, error: legacyServicesError } = await supabase
              .from('servicos')
              .select('*')
              .eq('id_negocio', businessId)
              .eq('ativo', true);
              
            if (legacyServicesError && legacyServicesError.code !== '42P01') {
              console.error("Error fetching from legacy services:", legacyServicesError);
            }
            
            if (legacyServices?.length) {
              // Map legacy data to new format
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
          } catch (err) {
            console.error("Error in legacy services fetch:", err);
          }
        }
        
        // Fetch staff
        const { data: staffData, error: staffError } = await supabase
          .from('professionals')
          .select('*')
          .eq('business_id', businessId)
          .eq('status', 'active');
          
        if (staffError && staffError.code !== '42P01') {
          console.error("Error fetching staff:", staffError);
        }
        
        let staffInfo = staffData || [];
        
        // If no staff found, try legacy table
        if (!staffInfo.length) {
          try {
            const { data: legacyStaff, error: legacyStaffError } = await supabase
              .from('funcionarios')
              .select('*')
              .eq('id_negocio', businessId)
              .eq('status', 'ativo');
              
            if (legacyStaffError && legacyStaffError.code !== '42P01') {
              console.error("Error fetching from legacy staff:", legacyStaffError);
            }
            
            if (legacyStaff?.length) {
              // Map legacy data to new format
              staffInfo = legacyStaff.map((staff: any) => ({
                id: staff.id,
                name: staff.nome,
                position: staff.cargo,
                photo_url: staff.foto_url,
                business_id: staff.id_negocio,
                specialties: staff.especializacoes
              }));
            }
          } catch (err) {
            console.error("Error in legacy staff fetch:", err);
          }
        }

        // Update state with all data
        setBusiness(businessInfo || null);
        setServices(servicesInfo || []);
        setStaff(staffInfo || []);
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
