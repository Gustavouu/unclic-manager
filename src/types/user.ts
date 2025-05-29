
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

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

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UserSession {
  user: User;
  token: string;
  expires: string;
}

export const ROLE_PERMISSIONS = {
  admin: ['all'],
  manager: ['read', 'write'],
  staff: ['read']
};
