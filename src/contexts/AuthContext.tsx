import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
          message: translateAuthError(error.message)
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
          message: translateAuthError(error.message)
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
        message: translateAuthError(error.message)
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

// Function to translate authentication errors to Portuguese
const translateAuthError = (errorMessage: string): string => {
  const translations: Record<string, string> = {
    'Invalid login credentials': 'Credenciais de login inválidas',
    'Email not confirmed': 'Email não confirmado',
    'User already registered': 'Usuário já registrado',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
    'Unable to validate email address: invalid format': 'Formato de email inválido',
    'For security purposes, you can only request this once every 60 seconds': 'Por motivos de segurança, você só pode solicitar isso uma vez a cada 60 segundos',
    'Email rate limit exceeded': 'Limite de taxa de email excedido',
    'signups not allowed': 'Cadastros não permitidos',
    'Invalid email or password': 'Email ou senha inválidos',
    'Too many requests': 'Muitas solicitações',
    'Network request failed': 'Falha na solicitação de rede',
    'Session expired': 'Sessão expirada',
    'User not found': 'Usuário não encontrado',
    'Password is too short': 'Senha muito curta',
    'Password is too weak': 'Senha muito fraca',
    'Email already registered': 'Email já registrado',
    'Invalid email': 'Email inválido'
  };

  // Try to find an exact match first
  if (translations[errorMessage]) {
    return translations[errorMessage];
  }

  // Try to find a partial match
  for (const [key, value] of Object.entries(translations)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Default fallback
  return 'Ocorreu um erro durante a autenticação. Tente novamente.';
};

// Keep the old export for backward compatibility
export const useAuthContext = useAuth;
