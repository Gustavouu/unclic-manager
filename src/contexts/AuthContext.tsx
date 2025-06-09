
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useContextualErrorHandler } from '@/hooks/useContextualErrorHandler';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  business_id: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const errorHandler = useContextualErrorHandler('AuthProvider');
  const isProduction = import.meta.env.PROD;

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error is ok for new users
        throw error;
      }

      setProfile(data);
    } catch (error) {
      if (!isProduction) {
        console.warn('Failed to load profile:', error);
      }
      // Don't throw error here as profile might not exist for new users
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadProfile(session.user.id);
        }
      } catch (error) {
        errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), 'medium', {
          showToast: false
        });
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isProduction) {
          console.log('Auth state changed:', event, session?.user?.id);
        }

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setLoading(false);
        }
        
        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [errorHandler, isProduction]);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: result.error };
    } catch (error) {
      const authError = error as AuthError;
      return { error: authError };
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      return { error: result.error };
    } catch (error) {
      const authError = error as AuthError;
      return { error: authError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      errorHandler.handleError(error instanceof Error ? error : new Error(String(error)), 'medium');
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const result = await supabase.auth.resetPasswordForEmail(email);
      return { error: result.error };
    } catch (error) {
      const authError = error as AuthError;
      return { error: authError };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          ...updates
        });

      if (error) {
        throw error;
      }

      // Reload profile
      await loadProfile(user.id);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error(String(error)) };
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
