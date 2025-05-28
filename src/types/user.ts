export type UserRole = 'admin' | 'professional' | 'client';

export type Permission = 
  | 'manage_business'
  | 'manage_professionals'
  | 'manage_services'
  | 'manage_appointments'
  | 'view_appointments'
  | 'manage_clients'
  | 'view_clients'
  | 'manage_settings'
  | 'view_settings';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  permissions?: Permission[];
  is_admin: boolean;
  onboarding_completed: boolean;
  role: UserRole;
  business_id?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  token: string;
  refreshToken: string;
  user: User;
  expires_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface PasswordReset {
  token: string;
  new_password: string;
}

export interface PasswordChange {
  current_password: string;
  new_password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface PermissionMap {
  [key: string]: Permission[];
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'manage_business',
    'manage_professionals',
    'manage_services',
    'manage_appointments',
    'view_appointments',
    'manage_clients',
    'view_clients',
    'manage_settings',
    'view_settings',
  ],
  professional: [
    'manage_appointments',
    'view_appointments',
    'view_clients',
  ],
  client: [
    'view_appointments',
  ],
}; 