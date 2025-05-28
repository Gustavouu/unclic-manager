import { supabase } from '@/lib/supabase';
import type {
  User,
  UserRole,
  Permission,
  LoginCredentials,
  PasswordReset,
  PasswordChange,
  AuthResponse,
  UserSession,
} from '@/types/user';
import { ROLE_PERMISSIONS } from '@/types/user';

export class AuthService {
  private static instance: AuthService;
  private currentSession: UserSession | null = null;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error('Invalid credentials');
    }

    const { user: authUser, session } = data;

    if (!authUser || !session) {
      throw new Error('Authentication failed');
    }

    // Get user role and business_id from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, business_id')
      .eq('id', authUser.id)
      .single();

    if (profileError || !profile) {
      throw new Error('User profile not found');
    }

    const user: User = {
      id: authUser.id,
      email: authUser.email!,
      role: profile.role as UserRole,
      business_id: profile.business_id,
      created_at: authUser.created_at,
      updated_at: authUser.updated_at,
    };

    const authResponse: AuthResponse = {
      token: session.access_token,
      refreshToken: session.refresh_token,
      user,
    };

    this.currentSession = {
      ...authResponse,
      expires_at: session.expires_at.toString(),
    };

    return authResponse;
  }

  public async logout(token?: string): Promise<void> {
    if (token) {
      await supabase.auth.signOut({ scope: 'local' });
    } else {
      await supabase.auth.signOut();
    }
    this.currentSession = null;
  }

  public async getSession(): Promise<UserSession | null> {
    if (this.currentSession) {
      return this.currentSession;
    }

    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return null;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, business_id')
      .eq('id', session.user.id)
      .single();

    if (!profile) {
      return null;
    }

    const user: User = {
      id: session.user.id,
      email: session.user.email!,
      role: profile.role as UserRole,
      business_id: profile.business_id,
      created_at: session.user.created_at,
      updated_at: session.user.updated_at,
    };

    this.currentSession = {
      token: session.access_token,
      refreshToken: session.refresh_token,
      user,
      expires_at: session.expires_at.toString(),
    };

    return this.currentSession;
  }

  public async requestPasswordReset(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw new Error('Failed to request password reset');
    }
  }

  public async resetPassword(token: string, newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error('Failed to reset password');
    }
  }

  public async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error('Failed to change password');
    }
  }

  public async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.refreshSession();

    if (error || !data.session) {
      throw new Error('Failed to refresh token');
    }

    const { user: authUser, session } = data;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, business_id')
      .eq('id', authUser.id)
      .single();

    if (!profile) {
      throw new Error('User profile not found');
    }

    const user: User = {
      id: authUser.id,
      email: authUser.email!,
      role: profile.role as UserRole,
      business_id: profile.business_id,
      created_at: authUser.created_at,
      updated_at: authUser.updated_at,
    };

    const authResponse: AuthResponse = {
      token: session.access_token,
      refreshToken: session.refresh_token,
      user,
    };

    this.currentSession = {
      ...authResponse,
      expires_at: session.expires_at.toString(),
    };

    return authResponse;
  }

  public async validateSession(token: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.getUser(token);
      return !error && !!data.user;
    } catch {
      return false;
    }
  }

  public async hasPermission(user: User, permission: Permission): Promise<boolean> {
    const userPermissions = ROLE_PERMISSIONS[user.role];
    return userPermissions.includes(permission);
  }
} 