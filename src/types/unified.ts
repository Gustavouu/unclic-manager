
// Tipos unificados para o sistema
export interface UnifiedClient {
  id: string;
  business_id: string;
  name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  notes?: string;
  status: 'active' | 'inactive';
  total_spent: number;
  last_visit?: string;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UnifiedAppointment {
  id: string;
  business_id: string;
  client_id: string;
  service_id: string;
  employee_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration: number;
  price: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'canceled' | 'no_show';
  notes?: string;
  payment_method?: string;
  rating?: number;
  feedback_comment?: string;
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface UnifiedService {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category?: string;
  is_active: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UnifiedEmployee {
  id: string;
  business_id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  bio?: string;
  photo_url?: string;
  specialties: string[];
  commission_percentage: number;
  hire_date?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface QueryOptions {
  cacheKey: string;
  ttl?: number;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
}
