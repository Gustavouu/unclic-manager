
export interface AppointmentFormValues {
  serviceId?: string;
  professionalId: string;
  clientId?: string;
  date?: Date;
  time?: string;
  notes?: string;
  status?: string;
  duration?: number;
  price?: number;
  paymentMethod?: string;
  notifications?: boolean;
  reminderSent?: boolean;
  rating?: number;
  feedbackComment?: string;
  termsAccepted?: boolean;
}

export interface Appointment {
  id: string;
  serviceId: string;
  professionalId: string;
  clientId?: string;
  date: Date;
  time: string;
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  duration: number;
  price: number;
  paymentMethod?: string;
  notifications: boolean;
  reminderSent?: boolean;
  rating?: number;
  feedbackComment?: string;
  createdAt: Date;
  updatedAt: Date;
}
