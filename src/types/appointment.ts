
export interface AppointmentCreate {
  business_id: string;
  client_id: string;
  professional_id: string;
  service_id: string;
  date: string;
  start_time: string;
  end_time: string;
  duration: number;
  price: number;
  status?: 'scheduled' | 'confirmed' | 'completed' | 'canceled' | 'no_show';
  notes?: string;
  payment_method?: string;
}

export interface AppointmentUpdate {
  status?: 'scheduled' | 'confirmed' | 'completed' | 'canceled' | 'no_show';
  notes?: string;
  payment_method?: string;
  rating?: number;
  feedback_comment?: string;
  start_time?: string;
  end_time?: string;
  price?: number;
}

export interface Appointment {
  id: string;
  business_id: string;
  client_id: string;
  professional_id: string;
  service_id: string;
  date: string;
  start_time: string;
  end_time: string;
  duration: number;
  price: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'canceled' | 'no_show';
  notes?: string;
  payment_method?: string;
  rating?: number;
  feedback_comment?: string;
  reminder_sent?: boolean;
  client_name?: string;
  professional_name?: string;
  service_name?: string;
  created_at: string;
  updated_at: string;
}

export interface AppointmentSearchParams {
  business_id: string;
  client_id?: string;
  professional_id?: string;
  service_id?: string;
  status?: 'scheduled' | 'confirmed' | 'completed' | 'canceled' | 'no_show';
  date_from?: string;
  date_to?: string;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
}

export interface AppointmentStats {
  total: number;
  scheduled: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  no_show: number;
  total_revenue: number;
  average_value: number;
  completion_rate: number;
  cancellation_rate: number;
}

export interface AppointmentConflict {
  conflict_details: string;
  conflicting_appointment_id: string;
}

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'canceled' | 'no_show';
