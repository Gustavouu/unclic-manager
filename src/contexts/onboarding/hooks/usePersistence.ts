
import { MutableRefObject } from 'react';
import { BusinessData, ServiceData, StaffData, BusinessHours, OnboardingMethod } from '../types';
import { supabase } from '@/integrations/supabase/client';

// Key for storing onboarding data in localStorage
const STORAGE_KEY = 'unclic-manager-onboarding';

export const usePersistence = (
  businessData: BusinessData,
  services: ServiceData[],
  staffMembers: StaffData[],
  businessHours: BusinessHours,
  hasStaff: boolean,
  currentStep: number,
  onboardingMethod: OnboardingMethod,
  hasLoaded: MutableRefObject<boolean>,
  setBusinessData: React.Dispatch<React.SetStateAction<BusinessData>>,
  setServices: React.Dispatch<React.SetStateAction<ServiceData[]>>,
  setStaffMembers: React.Dispatch<React.SetStateAction<StaffData[]>>,
  setBusinessHours: React.Dispatch<React.SetStateAction<BusinessHours>>,
  setHasStaff: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>,
  setOnboardingMethod: React.Dispatch<React.SetStateAction<OnboardingMethod>>
) => {
  // Function to save current progress to localStorage
  const saveProgress = () => {
    const data = {
      businessData,
      services,
      staffMembers,
      businessHours,
      hasStaff,
      currentStep,
      onboardingMethod,
      lastUpdated: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('Onboarding progress saved:', data);
    return true;
  };

  // Function to load saved progress from localStorage
  const loadProgress = () => {
    try {
      // Avoid loading data multiple times
      if (hasLoaded.current) return false;
      
      const savedData = localStorage.getItem(STORAGE_KEY);
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Update all state
        setBusinessData(parsedData.businessData || businessData);
        setServices(parsedData.services || []);
        setStaffMembers(parsedData.staffMembers || []);
        setBusinessHours(parsedData.businessHours || businessHours);
        setHasStaff(parsedData.hasStaff !== undefined ? parsedData.hasStaff : false);
        setCurrentStep(parsedData.currentStep || -1);
        setOnboardingMethod(parsedData.onboardingMethod || null);
        
        console.log('Onboarding progress loaded from localStorage:', parsedData);
        hasLoaded.current = true;
        return true;
      }
    } catch (error) {
      console.error('Error loading onboarding progress:', error);
    }
    
    return false;
  };

  // Function to load existing business data from the database
  const loadBusinessData = async (businessId: string) => {
    try {
      console.log('Loading existing business data:', businessId);
      
      // Load business data
      const { data: businessData, error: businessError } = await supabase
        .from('negocios')
        .select('*')
        .eq('id', businessId)
        .single();
      
      if (businessError) {
        throw businessError;
      }
      
      if (!businessData) {
        throw new Error("Negócio não encontrado");
      }
      
      // Load services
      const { data: servicesData, error: servicesError } = await supabase
        .from('servicos')
        .select('*')
        .eq('id_negocio', businessId);
      
      if (servicesError) {
        throw servicesError;
      }
      
      // Load staff
      const { data: staffData, error: staffError } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('id_negocio', businessId);
      
      if (staffError) {
        throw staffError;
      }
      
      // Load business hours
      const { data: hoursData, error: hoursError } = await supabase
        .from('horarios_disponibilidade')
        .select('*')
        .eq('id_negocio', businessId);
      
      if (hoursError) {
        throw hoursError;
      }
      
      // Map database data to state format
      const mappedBusinessData: BusinessData = {
        name: businessData.nome,
        email: businessData.email_admin,
        phone: businessData.telefone || "",
        cep: businessData.cep || "",
        address: businessData.endereco || "",
        number: businessData.numero || "",
        neighborhood: businessData.bairro || "",
        city: businessData.cidade || "",
        state: businessData.estado || "",
        description: businessData.descricao,
        logoUrl: businessData.url_logo,
        website: businessData.website,
      };
      
      const mappedServices: ServiceData[] = servicesData.map(service => ({
        id: service.id,
        name: service.nome,
        duration: service.duracao,
        price: service.preco,
        description: service.descricao || undefined,
      }));
      
      const mappedStaffMembers: StaffData[] = staffData.map(staff => ({
        id: staff.id,
        name: staff.nome,
        role: staff.cargo || "",
        email: staff.email || undefined,
        phone: staff.telefone || undefined,
        specialties: staff.especializacoes || [],
      }));
      
      // Create business hours object
      const dayMappingReverse: Record<number, string> = {
        0: "sunday",
        1: "monday",
        2: "tuesday",
        3: "wednesday",
        4: "thursday", 
        5: "friday",
        6: "saturday",
      };
      
      const mappedBusinessHours: BusinessHours = {
        monday: { open: false, openTime: "09:00", closeTime: "18:00" },
        tuesday: { open: false, openTime: "09:00", closeTime: "18:00" },
        wednesday: { open: false, openTime: "09:00", closeTime: "18:00" },
        thursday: { open: false, openTime: "09:00", closeTime: "18:00" },
        friday: { open: false, openTime: "09:00", closeTime: "18:00" },
        saturday: { open: false, openTime: "09:00", closeTime: "18:00" },
        sunday: { open: false, openTime: "09:00", closeTime: "18:00" },
      };
      
      // Fill in existing hours
      hoursData.forEach(hour => {
        const day = dayMappingReverse[hour.dia_semana];
        if (day && !hour.dia_folga) {
          mappedBusinessHours[day] = {
            open: true,
            openTime: hour.hora_inicio.slice(0, 5),
            closeTime: hour.hora_fim.slice(0, 5),
          };
        }
      });
      
      // Update all state
      setBusinessData(mappedBusinessData);
      setServices(mappedServices);
      setStaffMembers(mappedStaffMembers);
      setBusinessHours(mappedBusinessHours);
      setHasStaff(mappedStaffMembers.length > 0);
      
      console.log('Existing business data loaded successfully');
      hasLoaded.current = true;
      
      // Now also save this to localStorage for backup
      const data = {
        businessData: mappedBusinessData,
        services: mappedServices,
        staffMembers: mappedStaffMembers, 
        businessHours: mappedBusinessHours,
        hasStaff: mappedStaffMembers.length > 0,
        currentStep: 0,
        onboardingMethod: "manual",
        lastUpdated: new Date().toISOString(),
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      
      return true;
    } catch (error) {
      console.error('Error loading existing business data:', error);
      return false;
    }
  };

  return {
    saveProgress,
    loadProgress,
    loadBusinessData,
  };
};
