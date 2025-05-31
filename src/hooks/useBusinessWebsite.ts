
import { useState, useEffect } from "react";
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
  role?: string;
}

export interface SimpleService {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  business_id: string;
}

export const useBusinessWebsite = (businessId?: string) => {
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [staff, setStaff] = useState<SimpleStaff[]>([]);
  const [services, setServices] = useState<SimpleService[]>([]);
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
        // Fetch business data from businesses table
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', businessId)
          .single();

        if (!businessError && businessData) {
          setBusiness({
            id: businessData.id,
            name: businessData.name,
            description: businessData.description,
            logo_url: businessData.logo_url,
            phone: businessData.phone,
            address: businessData.address,
            address_number: businessData.address_number,
            city: businessData.city,
            state: businessData.state,
            zip_code: businessData.zip_code,
            admin_email: businessData.admin_email,
            neighborhood: businessData.neighborhood,
            currency: businessData.currency,
            timezone: businessData.timezone,
            created_at: businessData.created_at,
            updated_at: businessData.updated_at
          });
        }

        // Fetch staff from employees table
        const { data: employeesData, error: employeesError } = await supabase
          .from('employees')
          .select('*')
          .eq('business_id', businessId);
          
        let staffInfo: SimpleStaff[] = [];
        if (!employeesError && employeesData?.length) {
          staffInfo = employeesData.map((staff: any) => ({
            id: staff.id,
            name: staff.name,
            bio: staff.bio,
            photo_url: staff.photo_url,
            business_id: staff.business_id,
            specialties: staff.specialties || [],
            role: staff.position || 'staff'
          }));
        }

        setStaff(staffInfo);

        // Mock services data for now
        setServices([]);
      } catch (err: any) {
        console.error("Error loading website data:", err);
        setError(err.message || 'Error loading data');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [businessId]);

  const startBooking = () => setIsBookingOpen(true);
  const closeBooking = () => setIsBookingOpen(false);
  
  const checkIsCorrectBusiness = (id?: string) => {
    return id === businessId;
  };

  return {
    business,
    staff,
    services,
    loading,
    error,
    isBookingOpen,
    startBooking,
    closeBooking,
    checkIsCorrectBusiness
  };
};
