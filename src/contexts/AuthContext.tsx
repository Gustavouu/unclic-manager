import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { translateErrorMessage } from '@/utils/errorHandler';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  business_id: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signInWithProvider: (provider: 'google' | 'facebook' | 'github') => Promise<{ error?: any }>;
  signUp: (email: string, password: string) => Promise<{ error?: any }>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception fetching profile:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
          
          // Ensure user business access
          try {
            await supabase.rpc('ensure_user_business_access');
            console.log('User business access ensured');
          } catch (error) {
            console.error('Error ensuring user business access:', error);
          }
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Then get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          console.log('Initial session:', session?.user?.id);
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Fetch user profile
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
            
            // Ensure user business access for initial session as well
            try {
              await supabase.rpc('ensure_user_business_access');
              console.log('Initial user business access ensured');
            } catch (error) {
              console.error('Error ensuring initial user business access:', error);
            }
          }
        }
      } catch (error) {
        console.error('Exception getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log('Signing out...');
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
    console.log('Sign out successful');
    setProfile(null);
    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    console.log('Signing in with email:', email);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('Sign in response:', { user: data?.user?.id, error });
      
      if (error) {
        setLoading(false);
        // Translate error messages to Portuguese
        const translatedError = {
          ...error,
          message: translateErrorMessage(error.message)
        };
        return { error: translatedError };
      }
      
      // Don't set loading to false here - let onAuthStateChange handle it
      return { error: null };
    } catch (error) {
      console.error('Sign in exception:', error);
      setLoading(false);
      return { error };
    }
  };

  const signInWithProvider = async (provider: 'google' | 'facebook' | 'github') => {
    console.log(`Signing in with provider: ${provider}`);
    setLoading(true);
    
    try {
      // Setup redirect URL to the current origin
      const redirectTo = `${window.location.origin}/auth`;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo
        }
      });
      
      // If there's an immediate error (rare with OAuth)
      if (error) {
        console.error(`${provider} OAuth error:`, error);
        const translatedError = {
          ...error,
          message: translateErrorMessage(error.message)
        };
        setLoading(false);
        return { error: translatedError };
      }
      
      console.log(`${provider} OAuth initiated, URL:`, data?.url);
      // Don't reset loading state here since we're redirecting
      
      return { error: null };
    } catch (error: any) {
      console.error(`${provider} OAuth exception:`, error);
      setLoading(false);
      return { 
        error: {
          message: translateErrorMessage(error.message || `Erro na autenticação com ${provider}`)
        } 
      };
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('Signing up with email:', email);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      console.log('Sign up response:', { user: data?.user?.id, error });
      
      if (error) {
        const translatedError = {
          ...error,
          message: translateErrorMessage(error.message)
        };
        setLoading(false);
        return { error: translatedError };
      }
      
      setLoading(false);
      return { error };
    } catch (error) {
      console.error('Sign up exception:', error);
      setLoading(false);
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    console.log('Resetting password for email:', email);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
    
    if (error) {
      const translatedError = {
        ...error,
        message: translateErrorMessage(error.message)
      };
      console.log('Reset password response:', { error: translatedError });
      return { error: translatedError };
    }
    
    console.log('Reset password response: success');
    return { error: null };
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signOut,
    signIn,
    signInWithProvider,
    signUp,
    resetPassword,
    refreshProfile,
  };

  console.log('AuthProvider render - user:', user?.id, 'loading:', loading);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Keep the old export for backward compatibility
export const useAuthContext = useAuth;
