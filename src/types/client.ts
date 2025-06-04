
export interface Client {
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
  preferences?: any;
  last_visit?: string;
  total_spent: number;
  total_appointments?: number;
  status?: string; // Added status property
  created_at: string;
  updated_at: string;
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

export interface ClientCreate {
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
}

export interface ClientUpdate {
  name?: string;
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

export interface ClientSearchParams {
  business_id: string;
  search?: string;
  city?: string;
  state?: string;
  page?: number;
  limit?: number;
}

export interface ClientListResult {
  clients: Client[];
  total: number;
  page: number;
  limit: number;
}

export interface ClientOperationResult {
  success: boolean;
  data?: Client;
  error?: string;
}

export interface ClientStats {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalSpent: number;
  averageSpent: number;
  lastVisit: string | null;
  loyaltyPoints: number;
}
