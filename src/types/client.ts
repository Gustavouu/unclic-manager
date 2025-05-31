
export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  last_visit?: string;
  total_spent?: number;
  total_appointments?: number;
  city?: string;
  state?: string;
  zip_code?: string;
  avatar?: string;
  status?: string;
  address?: string;
  gender?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  business_id?: string;
  user_id?: string;
  preferences?: any;
}

export interface ClientFormData {
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
}

export interface ClientCreate extends ClientFormData {
  business_id: string;
}

export interface ClientUpdate extends Partial<ClientFormData> {}

export interface ClientStats {
  totalSpent: number;
  totalAppointments: number;
  averageSpent: number;
  lastVisit?: string;
  favoriteServices: string[];
}

export interface ClientSearchParams {
  search?: string;
  city?: string;
  state?: string;
  status?: string;
  lastVisit?: string;
  page?: number;
  limit?: number;
}

export interface ClientOperationResult {
  success: boolean;
  data?: Client;
  error?: string;
}

export interface ClientListResult {
  success: boolean;
  data?: Client[];
  count?: number;
  page?: number;
  limit?: number;
  error?: string;
}
