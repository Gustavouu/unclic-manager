
import { supabase } from '@/integrations/supabase/client';
import { AuthResponse, UserSession } from '@/types/auth';

export class AuthService {
  // Login with email and password
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!data.user || !data.session) {
        throw new Error('No user data returned');
      }

      return {
        user: data.user,
        session: {
          user: data.user,
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires: new Date(data.session.expires_at || 0).getTime(),
        },
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<any> {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Get current session
  async getCurrentSession(): Promise<UserSession | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (!session) return null;

      return {
        user: session.user,
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires: new Date(session.expires_at || 0).getTime(),
      };
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  // Sign up new user
  async signUp(email: string, password: string, userData?: any): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData || {}
        }
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('No user data returned');
      }

      const session = data.session ? {
        user: data.user,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires: new Date(data.session.expires_at || 0).getTime(),
      } : null;

      return {
        user: data.user,
        session: session!,
        access_token: data.session?.access_token || '',
        refresh_token: data.session?.refresh_token || '',
      };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<any> {
    return this.requestPasswordReset(email);
  }

  // Logout
  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Refresh session
  async refreshSession(): Promise<UserSession | null> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) throw error;
      
      if (!data.session) return null;

      return {
        user: data.session.user,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires: new Date(data.session.expires_at || 0).getTime(),
      };
    } catch (error) {
      console.error('Refresh session error:', error);
      return null;
    }
  }
}

export const authService = new AuthService();
