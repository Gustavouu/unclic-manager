
export type Permission = 
  | 'manage_business'
  | 'manage_professionals'
  | 'manage_services'
  | 'view_appointments'
  | 'manage_appointments'
  | 'view_clients'
  | 'manage_clients'
  | 'view_settings'
  | 'manage_settings'
  | 'view_reports'
  | 'manage_reports'
  | 'manage_users'
  | 'view_financial'
  | 'manage_financial';

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role?: string;
  business_id?: string;
}
