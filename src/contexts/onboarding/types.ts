
// Types for the onboarding context

// Business data types
export interface BusinessData {
  name: string;
  email: string;
  phone: string;
  logo?: File | null;
  logoUrl?: string;  // URL do preview do logo (blob ou base64)
  logoName?: string;  // Nome do arquivo do logo
  logoData?: string;  // Dados base64 do logo para persistência
  banner?: File | null;
  bannerUrl?: string;  // URL do preview do banner (blob ou base64) 
  bannerName?: string;  // Nome do arquivo do banner
  bannerData?: string;  // Dados base64 do banner para persistência
  cep: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

// Service types
export interface ServiceData {
  id: string;
  name: string;
  duration: number;
  price: number;
  description?: string;
}

// Staff types
export interface StaffData {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  specialties?: string[];
}

// Business hours types
export interface BusinessHours {
  [day: string]: {
    open: boolean;
    openTime: string;
    closeTime: string;
  };
}

// Onboarding context interface
export interface OnboardingContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  businessData: BusinessData;
  updateBusinessData: (data: Partial<BusinessData>) => void;
  services: ServiceData[];
  addService: (service: ServiceData) => void;
  removeService: (id: string) => void;
  updateService: (id: string, data: Partial<ServiceData>) => void;
  staffMembers: StaffData[];
  addStaffMember: (staff: StaffData) => void;
  removeStaffMember: (id: string) => void;
  updateStaffMember: (id: string, data: Partial<StaffData>) => void;
  businessHours: BusinessHours;
  updateBusinessHours: (day: string, data: Partial<BusinessHours[string]>) => void;
  hasStaff: boolean;
  setHasStaff: (value: boolean) => void;
  isComplete: () => boolean;
  saveProgress: () => void;
  loadProgress: () => void;
}
