
export type UserRole = 'admin' | 'manager' | 'staff' | 'owner';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  business_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UserSession extends AuthResponse {
  expires: string;
}

export type Permission = 
  | 'appointments.view'
  | 'appointments.create'
  | 'appointments.edit'
  | 'appointments.delete'
  | 'clients.view'
  | 'clients.create'
  | 'clients.edit'
  | 'clients.delete'
  | 'services.manage'
  | 'professionals.manage'
  | 'finance.view'
  | 'finance.manage'
  | 'reports.view'
  | 'settings.manage';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'appointments.view', 'appointments.create', 'appointments.edit', 'appointments.delete',
    'clients.view', 'clients.create', 'clients.edit', 'clients.delete',
    'services.manage', 'professionals.manage', 'finance.view', 'finance.manage',
    'reports.view', 'settings.manage'
  ],
  owner: [
    'appointments.view', 'appointments.create', 'appointments.edit', 'appointments.delete',
    'clients.view', 'clients.create', 'clients.edit', 'clients.delete',
    'services.manage', 'professionals.manage', 'finance.view', 'finance.manage',
    'reports.view', 'settings.manage'
  ],
  manager: [
    'appointments.view', 'appointments.create', 'appointments.edit',
    'clients.view', 'clients.create', 'clients.edit',
    'services.manage', 'professionals.manage', 'reports.view'
  ],
  staff: [
    'appointments.view', 'appointments.create', 'appointments.edit',
    'clients.view', 'clients.create', 'clients.edit'
  ]
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface PasswordReset {
  email: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
}
