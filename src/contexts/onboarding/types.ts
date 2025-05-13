// Types for the onboarding context

// Business data types
export interface BusinessData {
  name: string;
  email: string;
  phone: string;
  description?: string;
  logo?: File | null;
  logoUrl?: string;
  logoName?: string;
  logoData?: string;
  banner?: File | null;
  bannerUrl?: string;
  bannerName?: string;
  bannerData?: string;
  zipCode?: string;
  address?: string;
  addressNumber?: string;
  addressComplement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  // Add compatibility fields for existing code
  cep?: string;
  number?: string;
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

// Onboarding method types
export type OnboardingMethod = "import" | "upload" | "manual" | null;

// Onboarding status types
export type OnboardingStatus = "idle" | "loading" | "saving" | "processing" | "verifying" | "error" | "success";

// Extended onboarding context interface
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
  onboardingMethod: OnboardingMethod;
  setOnboardingMethod: (method: OnboardingMethod) => void;
  status: OnboardingStatus;
  setStatus: (status: OnboardingStatus) => void;
  error: string | null;
  setError: (error: string | null) => void;
  processingStep: string | null;
  setProcessingStep: (step: string | null) => void;
  resetOnboarding: () => void;
  businessCreated: {id?: string; slug?: string} | null;
  setBusinessCreated: (data: {id?: string; slug?: string} | null) => void;
}
