
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  
  // Alias methods for backward compatibility
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
  
  // Default values for alias methods
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // If session changes, we need to update user's business ID in localStorage
        if (session?.user) {
          // We use setTimeout to avoid supabase auth deadlocks
          setTimeout(async () => {
            try {
              const { data, error } = await supabase
                .from('usuarios')
                .select('id_negocio')
                .eq('id', session.user.id)
                .maybeSingle();
                
              if (data?.id_negocio) {
                localStorage.setItem('currentBusinessId', data.id_negocio);
              }
            } catch (err) {
              console.error("Error fetching business ID on auth state change:", err);
            }
          }, 0);
        }
        
        setLoading(false);
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      // If we have a session, fetch business ID
      if (session?.user) {
        try {
          const { data, error } = await supabase
            .from('usuarios')
            .select('id_negocio')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (data?.id_negocio) {
            localStorage.setItem('currentBusinessId', data.id_negocio);
          }
        } catch (err) {
          console.error("Error fetching business ID on initialization:", err);
        }
      }
      
      setLoading(false);
    };

    initializeAuth();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        throw error;
      }
      
      toast.success("Login realizado com sucesso!");
      return data;
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast.error(error.message || "Falha ao fazer login");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      // Ensure userData is properly formatted as an object, not a string
      const userMetadata = typeof userData === 'string' ? { nome_completo: userData } : userData;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata, // Correctly formatted user metadata
        },
      });

      if (error) {
        console.error("Signup error:", error);
        throw error;
      }
      
      toast.success("Conta criada com sucesso!");
      return data;
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast.error(error.message || "Falha ao criar conta");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      // Clear business ID from localStorage
      localStorage.removeItem('currentBusinessId');
      localStorage.removeItem('tenant_id');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      toast.success("Logout realizado com sucesso!");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error(error.message || "Falha ao fazer logout");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: any) => {
    try {
      if (!user) throw new Error("No user logged in");
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        data: userData
      });
      
      if (error) throw error;
      
      toast.success("Perfil atualizado com sucesso!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Falha ao atualizar perfil");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      
      toast.success("Email de recuperação enviado com sucesso!");
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast.error(error.message || "Falha ao enviar email de recuperação");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Alias methods for backward compatibility
  const login = (email: string, password: string) => signIn(email, password);
  const signup = (email: string, password: string, name: string) => signUp(email, password, { nome_completo: name });
  const logout = () => signOut();

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        // Alias methods
        login,
        signup,
        logout,
        resetPassword,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
