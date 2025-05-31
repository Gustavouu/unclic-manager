
export interface BusinessData {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  phone?: string;
  address?: string;
  addressNumber?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  adminEmail?: string;
  neighborhood?: string;
  ownerName?: string;
  businessType?: string;
  // Legacy support
  admin_email?: string;
  logo_url?: string;
  address_number?: string;
  zip_code?: string;
  email?: string;
  cep?: string;
  number?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    website?: string;
  };
  bannerUrl?: string;
}

export interface ServiceData {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  duracao: number;
  ativo: boolean;
  categoria?: string;
  // English equivalents for compatibility
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  active?: boolean;
}

export interface StaffData {
  id: string;
  nome: string;
  cargo?: string;
  especializacoes?: string[];
  foto_url?: string;
  bio?: string;
  email?: string;
  phone?: string;
  // English equivalents
  name?: string;
  role?: string;
  specialties?: string[];
  photo_url?: string;
}

export interface BusinessHours {
  [key: string]: {
    start: string;
    end: string;
    isOpen: boolean;
    open?: boolean;
    openTime?: string;
    closeTime?: string;
  };
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface OnboardingState {
  currentStep: number;
  businessData: BusinessData;
  services: ServiceData[];
  staff: StaffData[];
  businessHours: BusinessHours | null;
  isComplete: boolean;
  onboardingMethod?: OnboardingMethod;
}

export type OnboardingMethod = 'import' | 'upload' | 'manual' | null;

export type OnboardingStatus = 'idle' | 'processing' | 'verifying' | 'saving' | 'complete' | 'error';

export interface OnboardingContextType {
  currentStep: number;
  businessData: BusinessData;
  services: ServiceData[];
  staff: StaffData[];
  businessHours: BusinessHours | null;
  isComplete: boolean;
  onboardingMethod: OnboardingMethod;
  status: OnboardingStatus;
  error: string | null;
  
  setCurrentStep: (step: number) => void;
  updateBusinessData: (data: Partial<BusinessData>) => void;
  addService: (service: ServiceData) => void;
  updateService: (id: string, service: Partial<ServiceData>) => void;
  removeService: (id: string) => void;
  addStaff: (staff: StaffData) => void;
  updateStaff: (id: string, staff: Partial<StaffData>) => void;
  removeStaff: (id: string) => void;
  updateBusinessHours: (hours: BusinessHours) => void;
  setOnboardingMethod: (method: OnboardingMethod) => void;
  completeOnboarding: () => Promise<void>;
  saveProgress: () => void;
  loadProgress: () => void;
  resetOnboarding: () => void;
}
