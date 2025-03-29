
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

// Add interface definitions for the component props
export interface CloseButtonProps {
  onClick: () => void;
}

export interface BookingProgressProps {
  currentStep: number;
  getStepTitle?: () => string;
}

export interface StepContentProps {
  step: number;
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  services: any[];
  staff: any[];
  onComplete: () => void;
  businessName: string;
  children?: React.ReactNode;
}

export interface StepNavigatorProps {
  step: number;
  onNext: () => void;
  onPrevious: () => void;
  bookingData: BookingData;
}
