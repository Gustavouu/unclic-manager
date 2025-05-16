
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
export type PaymentStatus = 'pending' | 'paid' | 'partially_paid' | 'refunded';

export interface Appointment {
  id: string;
  business_id: string;
  client_id: string;
  professional_id: string;
  service_id: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  notes?: string | null;
  payment_status?: PaymentStatus | null;
  payment_method?: string | null;
  total_amount: number;
  paid_amount: number;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAppointmentData {
  client_id: string;
  professional_id: string;
  service_id: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  notes?: string;
  payment_status?: PaymentStatus;
  payment_method?: string;
  total_amount?: number;
  paid_amount?: number;
}

export interface UpdatedAppointmentData {
  client_id?: string;
  professional_id?: string;
  service_id?: string;
  start_time?: string;
  end_time?: string;
  status?: AppointmentStatus;
  notes?: string;
  payment_status?: PaymentStatus;
  payment_method?: string;
  total_amount?: number;
  paid_amount?: number;
}

export interface AppointmentFilters {
  startDate?: Date;
  endDate?: Date;
  professionalId?: string;
  clientId?: string;
  serviceId?: string;
  status?: AppointmentStatus | AppointmentStatus[];
}

export interface TimeOff {
  id: string;
  business_id: string;
  professional_id?: string | null;
  start_date: string;
  end_date: string;
  reason?: string | null;
  is_approved: boolean;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTimeOffData {
  professional_id?: string;
  start_date: string;
  end_date: string;
  reason?: string;
  is_approved?: boolean;
}

export interface UpdateTimeOffData {
  professional_id?: string;
  start_date?: string;
  end_date?: string;
  reason?: string;
  is_approved?: boolean;
}
