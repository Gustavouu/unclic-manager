export type Business = {
  id: string;
  name: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  settings?: {
    theme?: string;
    currency?: string;
    timezone?: string;
    [key: string]: any;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type BusinessSettings = {
  id: string;
  business_id: string;
  company_name: string;
  business_hours: {
    [key: string]: {
      open: string;
      close: string;
      is_closed: boolean;
    };
  };
  appointment_interval: number;
  min_advance_time: number;
  max_advance_time: number;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  business_id: string;
  email: string;
  name: string;
  role: 'admin' | 'professional' | 'receptionist';
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Client = {
  id: string;
  business_id: string;
  name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Service = {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Professional = {
  id: string;
  business_id: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  specialties: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProfessionalSchedule = {
  id: string;
  professional_id: string;
  day_of_week: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Appointment = {
  id: string;
  business_id: string;
  client_id: string;
  professional_id: string;
  service_id: string;
  date_time: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  price: number;
  payment_method?: string;
  created_at: string;
  updated_at: string;
}; 