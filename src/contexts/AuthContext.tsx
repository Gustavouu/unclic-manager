
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError, AuthResponse } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, options?: { data?: any }) => Promise<AuthResponse>;
  signOut: () => Promise<{ error: AuthError | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => ({ data: { user: null, session: null }, error: null }),
  signUp: async () => ({ data: { user: null, session: null }, error: null }),
  signOut: async () => ({ error: null }),
  logout: async () => {},
});

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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (response.error) {
        toast.error(response.error.message);
      } else if (response.data.user) {
        toast.success('Login realizado com sucesso!');
      }
      
      return response;
    } catch (error) {
      console.error('Error signing in:', error);
      const authError: AuthError = {
        name: 'AuthError',
        message: 'Erro inesperado ao fazer login'
      };
      return { data: { user: null, session: null }, error: authError };
    }
  };

  const signUp = async (email: string, password: string, options?: { data?: any }): Promise<AuthResponse> => {
    try {
      const response = await supabase.auth.signUp({
        email,
        password,
        options,
      });
      
      if (response.error) {
        toast.error(response.error.message);
      } else if (response.data.user) {
        toast.success('Conta criada com sucesso!');
      }
      
      return response;
    } catch (error) {
      console.error('Error signing up:', error);
      const authError: AuthError = {
        name: 'AuthError',
        message: 'Erro inesperado ao criar conta'
      };
      return { data: { user: null, session: null }, error: authError };
    }
  };

  const signOut = async (): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        return { error };
      }
      
      toast.success('Logout realizado com sucesso!');
      return { error: null };
    } catch (error) {
      console.error('Error signing out:', error);
      const authError: AuthError = {
        name: 'AuthError',
        message: 'Erro inesperado ao fazer logout'
      };
      return { error: authError };
    }
  };

  const logout = async (): Promise<void> => {
    await signOut();
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
