
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
  allow_remote_queue?: boolean;
  remote_queue_limit?: number;
  require_advance_payment?: boolean;
  minimum_notice_time?: number;
  maximum_days_in_advance?: number;
  allow_simultaneous_appointments?: boolean;
  require_manual_confirmation?: boolean;
  block_no_show_clients?: boolean;
  send_email_confirmation?: boolean;
  send_reminders?: boolean;
  reminder_hours?: number;
  send_followup_message?: boolean;
  followup_hours?: number;
  cancellation_policy_hours?: number;
  no_show_fee?: number;
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
  banner_url?: string;
  cancellation_policy?: string;
  cancellation_message?: string;
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
  admin_email: string;
  phone?: string;
  zip_code?: string;
  address?: string;
  address_number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  timezone?: string;
  settings?: BusinessSettings;
}

export interface BusinessUpdate {
  name?: string;
  phone?: string;
  address?: string;
  address_number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  description?: string;
  logo_url?: string;
  settings?: Partial<BusinessSettings>;
}
