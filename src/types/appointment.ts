export interface Appointment {
  id: string;
  business_id: string;
  client_id: string;
  professional_id: string;
  service_id: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  price: number;
  payment_status: 'pending' | 'paid' | 'refunded' | 'partially_paid';
  payment_method: 'credit_card' | 'debit_card' | 'cash' | 'pix' | null;
  notes: string | null;
  cancellation_reason: string | null;
  cancellation_fee: number | null;
  created_at: string;
  updated_at: string;
}

export interface AppointmentCreate {
  business_id: string;
  client_id: string;
  professional_id: string;
  service_id: string;
  start_time: string;
  end_time: string;
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  price: number;
  payment_status?: 'pending' | 'paid' | 'refunded' | 'partially_paid';
  payment_method?: 'credit_card' | 'debit_card' | 'cash' | 'pix' | null;
  notes?: string | null;
  cancellation_reason?: string | null;
  cancellation_fee?: number | null;
}

export interface AppointmentUpdate {
  professional_id?: string;
  service_id?: string;
  start_time?: string;
  end_time?: string;
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  price?: number;
  payment_status?: 'pending' | 'paid' | 'refunded' | 'partially_paid';
  payment_method?: 'credit_card' | 'debit_card' | 'cash' | 'pix' | null;
  notes?: string | null;
  cancellation_reason?: string | null;
  cancellation_fee?: number | null;
}

export interface AppointmentStats {
  totalAppointments: number;
  totalRevenue: number;
  averageAppointmentValue: number;
  completionRate: number;
  cancellationRate: number;
  noShowRate: number;
  mostPopularService: string | null;
  mostPopularProfessional: string | null;
  busiestDay: string | null;
  busiestTime: string | null;
}

export interface AppointmentSearchParams {
  business_id: string;
  client_id?: string;
  professional_id?: string;
  service_id?: string;
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  payment_status?: 'pending' | 'paid' | 'refunded' | 'partially_paid';
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
}

export interface AppointmentConflict {
  appointment_id: string;
  professional_id: string;
  start_time: string;
  end_time: string;
  conflict_type: 'professional' | 'client' | 'service';
  conflict_details: string;
} 