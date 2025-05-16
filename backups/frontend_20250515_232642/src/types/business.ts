export interface Business {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  logo_url?: string;
  website?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessSettings {
  id: string;
  business_id: string;
  working_hours: {
    [key: string]: {
      start: string;
      end: string;
      is_working_day: boolean;
    };
  };
  appointment_duration: number; // em minutos
  break_duration: number; // em minutos
  max_appointments_per_day: number;
  allow_same_day_appointments: boolean;
  allow_weekend_appointments: boolean;
  notification_settings: {
    email_notifications: boolean;
    sms_notifications: boolean;
    reminder_before: number; // em minutos
  };
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  business_id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'professional' | 'receptionist';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  business_id: string;
  name: string;
  email: string;
  phone: string;
  birth_date?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  duration: number; // em minutos
  price: number;
  color?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Professional {
  id: string;
  business_id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  specialties?: string[];
  bio?: string;
  photo_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalSchedule {
  id: string;
  professional_id: string;
  day_of_week: number; // 0-6 (Domingo-Sábado)
  start_time: string;
  end_time: string;
  is_working_day: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  business_id: string;
  client_id: string;
  professional_id: string;
  service_id: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  created_at: string;
  updated_at: string;
} 