
export interface BookingFlowProps {
  businessName: string;
  closeFlow: () => void;
  services?: any[];
  staff?: any[];
}

export interface ClientData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface BookingData {
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  professionalId: string;
  professionalName: string;
  date?: Date;
  time: string;
  notes: string;
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
}

export interface ExtendedServiceData {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  active: boolean;
  category?: string;
}

export interface ExtendedStaffData {
  id: string;
  name: string;
  role: string;
  specialties: string[];
  photo_url?: string;
  bio?: string;
  availability?: boolean;
}

// Component props interfaces
export interface CloseButtonProps {
  onClick: () => void;
}

export interface BookingProgressProps {
  currentStep: number;
  getStepTitle?: () => string;
}

export interface StepContentProps {
  step: number;
  children?: React.ReactNode;
}

export interface StepNavigatorProps {
  step: number;
  onPrevious: () => void;
}
