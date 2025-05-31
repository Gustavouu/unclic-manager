
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface Permission {
  id: string;
  name: string;
  module: string;
  action: string;
}

export interface UserPermissions {
  role: Role;
  permissions: Permission[];
  isLoading: boolean;
  error: string;
  hasPermission: (permissionName: string) => boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
  canAccess: (requiredPermissions: string[]) => boolean;
  refreshPermissions: () => Promise<void>;
}
