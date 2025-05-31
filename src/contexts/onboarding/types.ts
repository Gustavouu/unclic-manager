
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
  onboardingMethod?: 'import' | 'upload' | 'manual';
}
