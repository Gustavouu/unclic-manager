
import { useState, useCallback, useRef } from "react";
import { 
  BusinessData, 
  ServiceData, 
  StaffData, 
  BusinessHours 
} from "./types";
import { initialBusinessData, initialBusinessHours } from "./initialValues";
import { checkOnboardingComplete, prepareDataForStorage } from "./utils";

export const useOnboardingState = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [businessData, setBusinessData] = useState<BusinessData>(initialBusinessData);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffData[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHours>(initialBusinessHours);
  const [hasStaff, setHasStaff] = useState<boolean>(false);
  const hasLoaded = useRef(false);

  // Atualiza os dados do estabelecimento
  const updateBusinessData = useCallback((data: Partial<BusinessData>) => {
    setBusinessData(prev => ({ ...prev, ...data }));
  }, []);

  // Funções para gerenciar serviços
  const addService = useCallback((service: ServiceData) => {
    setServices(prev => [...prev, service]);
  }, []);

  const removeService = useCallback((id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  }, []);

  const updateService = useCallback((id: string, data: Partial<ServiceData>) => {
    setServices(prev => 
      prev.map(service => service.id === id ? { ...service, ...data } : service)
    );
  }, []);

  // Funções para gerenciar funcionários
  const addStaffMember = useCallback((staff: StaffData) => {
    setStaffMembers(prev => [...prev, staff]);
  }, []);

  const removeStaffMember = useCallback((id: string) => {
    setStaffMembers(prev => prev.filter(staff => staff.id !== id));
  }, []);

  const updateStaffMember = useCallback((id: string, data: Partial<StaffData>) => {
    setStaffMembers(prev => 
      prev.map(staff => staff.id === id ? { ...staff, ...data } : staff)
    );
  }, []);

  // Atualiza os horários de funcionamento
  const updateBusinessHours = useCallback((day: string, data: Partial<BusinessHours[string]>) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: { ...prev[day], ...data }
    }));
  }, []);

  // Verifica se todas as informações obrigatórias foram preenchidas
  const isComplete = useCallback(() => {
    return checkOnboardingComplete(businessData, services, staffMembers, hasStaff);
  }, [businessData, services, staffMembers, hasStaff]);

  // Salva o progresso no localStorage
  const saveProgress = useCallback(() => {
    // Skip saving if initial load hasn't completed yet
    if (!hasLoaded.current) return;
    
    const data = {
      businessData: prepareDataForStorage(businessData),
      services,
      staffMembers,
      businessHours,
      hasStaff,
      currentStep
    };
    
    localStorage.setItem('onboardingData', JSON.stringify(data));
  }, [businessData, services, staffMembers, businessHours, hasStaff, currentStep]);

  // Carrega o progresso do localStorage
  const loadProgress = useCallback(() => {
    // Skip loading if already loaded
    if (hasLoaded.current) return;
    
    const savedData = localStorage.getItem('onboardingData');
    
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Load business data without logo and banner (they can't be stored in localStorage)
        const loadedBusinessData = { ...parsed.businessData };
        
        setBusinessData(prev => ({ ...prev, ...loadedBusinessData }));
        setServices(parsed.services || []);
        setStaffMembers(parsed.staffMembers || []);
        setBusinessHours(parsed.businessHours || initialBusinessHours);
        setHasStaff(parsed.hasStaff || false);
        setCurrentStep(parsed.currentStep || 0);
        
        // Mark as loaded to prevent re-loading
        hasLoaded.current = true;
      } catch (error) {
        console.error("Erro ao carregar dados do onboarding:", error);
      }
    } else {
      hasLoaded.current = true; // Mark as loaded even if no data found
    }
  }, []);

  return {
    currentStep,
    setCurrentStep,
    businessData,
    updateBusinessData,
    services,
    addService,
    removeService,
    updateService,
    staffMembers,
    addStaffMember,
    removeStaffMember,
    updateStaffMember,
    businessHours,
    updateBusinessHours,
    hasStaff,
    setHasStaff,
    isComplete,
    saveProgress,
    loadProgress
  };
};
