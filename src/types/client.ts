
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
  created_at: string;
  updated_at: string;
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
