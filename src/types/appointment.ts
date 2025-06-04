
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
}

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'canceled' | 'no_show';
