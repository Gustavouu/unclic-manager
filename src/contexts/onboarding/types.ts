
import { ReactNode } from 'react';

export type OnboardingMethod = 'manual' | 'ai' | null;
export type OnboardingStatus = 'idle' | 'processing' | 'verifying' | 'saving' | 'complete' | 'success' | 'error';

export interface BusinessData {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  bannerUrl?: string;
  phone: string;
  address: string;
  addressNumber: string;
  addressComplement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  adminEmail: string;
  email?: string;
  ownerName: string;
  businessType: string;
  number?: string;
  cep?: string;
}

export interface ServiceData {
  id?: string;
  nome?: string;
  name?: string;
  descricao?: string;
  description?: string;
  preco?: number;
  price?: number;
  duracao?: number;
  duration?: number;
  categoria?: string;
  category?: string;
  ativo?: boolean;
  active?: boolean;
}

export interface StaffData {
  id?: string;
  nome?: string;
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
  ativo?: boolean;
  active?: boolean;
}

export interface BusinessHours {
  [key: string]: {
    isOpen?: boolean;
    open?: boolean;
    start?: string;
    end?: string;
    openTime?: string;
    closeTime?: string;
  };
}

export interface CompletionResult {
  success: boolean;
  businessId?: string;
  error?: string;
}

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
  
  // Actions
  setCurrentStep: (step: number) => void;
  updateBusinessData: (data: Partial<BusinessData>) => void;
  addService: (service: ServiceData) => void;
  updateService: (index: number, service: ServiceData) => void;
  removeService: (index: number) => void;
  addStaff: (staff: StaffData) => void;
  updateStaff: (index: number, staff: StaffData) => void;
  removeStaff: (index: number) => void;
  addStaffMember: (staff: StaffData) => void;
  updateStaffMember: (index: number, staff: StaffData) => void;
  removeStaffMember: (index: number) => void;
  setHasStaff: (hasStaff: boolean) => void;
  updateBusinessHours: (hours: BusinessHours) => void;
  setOnboardingMethod: (method: OnboardingMethod) => void;
  completeOnboarding: () => Promise<CompletionResult>;
  saveProgress: () => void;
  loadProgress: () => void;
  resetOnboarding: () => void;
}
