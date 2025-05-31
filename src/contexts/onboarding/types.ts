
export interface BusinessData {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  phone?: string;
  address?: string;
  addressNumber?: string;
  addressComplement?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  adminEmail?: string;
  neighborhood?: string;
  ownerName?: string;
  businessType?: string;
  website?: string;
  // Legacy support
  admin_email?: string;
  logo_url?: string;
  address_number?: string;
  zip_code?: string;
  email?: string;
  cep?: string;
  number?: string;
  logo?: string | null;
  banner?: string | null;
  logoData?: string;
  bannerData?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    website?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface ServiceData {
  id: string;
  nome: string;
  name?: string;
  descricao?: string;
  description?: string;
  preco: number;
  price?: number;
  duracao: number;
  duration?: number;
  ativo: boolean;
  active?: boolean;
  categoria?: string;
  category?: string;
}

export interface StaffData {
  id: string;
  nome: string;
  name?: string;
  cargo?: string;
  role?: string;
  especializacoes?: string[];
  specialties?: string[];
  foto_url?: string;
  photo_url?: string;
  bio?: string;
  email?: string;
  phone?: string;
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

export type OnboardingStatus = 'idle' | 'processing' | 'verifying' | 'saving' | 'complete' | 'success' | 'error';

export interface OnboardingContextType {
  currentStep: number;
  businessData: BusinessData;
  services: ServiceData[];
  staff: StaffData[];
  staffMembers: StaffData[];
  businessHours: BusinessHours | null;
  isComplete: boolean;
  onboardingMethod: OnboardingMethod;
  status: OnboardingStatus;
  error: string | null;
  hasStaff: boolean;
  processingStep?: string;
  businessCreated?: { id: string };
  
  setCurrentStep: (step: number) => void;
  updateBusinessData: (data: Partial<BusinessData>) => void;
  addService: (service: ServiceData) => void;
  updateService: (id: string, service: Partial<ServiceData>) => void;
  removeService: (id: string) => void;
  addStaff: (staff: StaffData) => void;
  updateStaff: (id: string, staff: Partial<StaffData>) => void;
  removeStaff: (id: string) => void;
  addStaffMember: (staff: StaffData) => void;
  updateStaffMember: (id: string, staff: Partial<StaffData>) => void;
  removeStaffMember: (id: string) => void;
  setHasStaff: (hasStaff: boolean) => void;
  updateBusinessHours: (hours: BusinessHours) => void;
  setOnboardingMethod: (method: OnboardingMethod) => void;
  completeOnboarding: () => Promise<void>;
  saveProgress: () => void;
  loadProgress: () => void;
  resetOnboarding: () => void;
}
