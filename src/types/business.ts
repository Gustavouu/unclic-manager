
export interface Business {
  id: string;
  name: string;
  slug: string;
  admin_email: string;
  phone?: string;
  address?: string;
  address_number?: string;
  address_complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  logo_url?: string;
  description?: string;
  ein?: string;
  legal_name?: string;
  trade_name?: string;
  status: 'active' | 'inactive' | 'pending';
  subscription_status: 'trial' | 'active' | 'suspended' | 'cancelled';
  timezone?: string;
  currency?: string;
  language?: string;
  latitude?: number;
  longitude?: number;
  subscription_end_date?: string;
  trial_end_date?: string;
  settings?: BusinessSettings;
  created_at: string;
  updated_at: string;
}

export interface BusinessSettings {
  theme?: string;
  notifications?: {
    email?: boolean;
    sms?: boolean;
  };
  booking?: {
    advance_payment_required?: boolean;
    minimum_notice_hours?: number;
    maximum_advance_days?: number;
  };
}

export interface BusinessCreate {
  name: string;
  slug: string;
  admin_email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  description?: string;
  timezone?: string;
  currency?: string;
  language?: string;
}

export interface BusinessUpdate {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  description?: string;
  logo_url?: string;
  settings?: Partial<BusinessSettings>;
}
