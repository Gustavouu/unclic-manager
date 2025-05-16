
/**
 * Database schema types for the application
 */

export interface NotificationSettings {
  id: string;
  id_negocio: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  new_appointment_alert: boolean;
  cancel_appointment_alert: boolean;
  client_feedback_alert: boolean;
  message_template?: string;
}

export interface BusinessSettings {
  id: string;
  business_id: string;
  allow_online_booking: boolean;
  require_advance_payment: boolean;
  minimum_notice_time: number;
  maximum_days_in_advance: number;
  logo_url: string | null;
  banner_url: string | null;
  primary_color: string;
  secondary_color: string;
  created_at: string;
  updated_at: string;
  notes?: string | null;
}
