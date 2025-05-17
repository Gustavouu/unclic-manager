
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { tableExists } from "@/utils/databaseUtils";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  
  // Add these methods to fix the auth-related errors
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
  
  // Add these methods to the default context value
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  resetPassword: async () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasUsuariosTable, setHasUsuariosTable] = useState<boolean | null>(null);

  // Check if usuarios table exists
  useEffect(() => {
    const checkTables = async () => {
      try {
        const usuariosExists = await tableExists('usuarios');
        setHasUsuariosTable(usuariosExists);
        console.log('Usuarios table exists:', usuariosExists);
      } catch (error) {
        console.error('Error checking for usuarios table:', error);
        setHasUsuariosTable(false);
      }
    };
    
    checkTables();
  }, []);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // If session changes, we need to update user's business ID in localStorage
        if (session?.user) {
          // We use setTimeout to avoid supabase auth deadlocks
          setTimeout(async () => {
            try {
              // Adaptive query based on table existence
              if (hasUsuariosTable === true) {
                const { data, error } = await supabase
                  .from('usuarios')
                  .select('id_negocio')
                  .eq('id', session.user.id)
                  .maybeSingle();
                  
                if (data?.id_negocio) {
                  localStorage.setItem('currentBusinessId', data.id_negocio);
                }
              } else if (hasUsuariosTable === false) {
                // Try business_users table
                const { data, error } = await supabase
                  .from('business_users')
                  .select('business_id')
                  .eq('user_id', session.user.id)
                  .maybeSingle();
                  
                if (data?.business_id) {
                  localStorage.setItem('currentBusinessId', data.business_id);
                }
              }
              // If hasUsuariosTable is still null (loading), we'll skip this update
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
      if (session?.user && hasUsuariosTable !== null) {
        try {
          if (hasUsuariosTable) {
            // Try usuarios table
            const { data, error } = await supabase
              .from('usuarios')
              .select('id_negocio')
              .eq('id', session.user.id)
              .maybeSingle();
              
            if (data?.id_negocio) {
              localStorage.setItem('currentBusinessId', data.id_negocio);
            }
          } else {
            // Try business_users table
            const { data, error } = await supabase
              .from('business_users')
              .select('business_id')
              .eq('user_id', session.user.id)
              .maybeSingle();
              
            if (data?.business_id) {
              localStorage.setItem('currentBusinessId', data.business_id);
            }
          }
        } catch (err) {
          console.error("Error fetching business ID on initialization:", err);
        }
      }
      
      setLoading(false);
    };

    // Only run initialization if we know which tables exist
    if (hasUsuariosTable !== null) {
      initializeAuth();
    }

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [hasUsuariosTable]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData, // Store user profile data like name
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Clear business ID from localStorage
      localStorage.removeItem('currentBusinessId');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const updateProfile = async (userData: any) => {
    try {
      if (!user) throw new Error("No user logged in");
      
      const { error } = await supabase.auth.updateUser({
        data: userData
      });
      
      if (error) throw error;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  };

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
        // Alias the functions to maintain backward compatibility
        login: signIn,
        signup: signUp,
        logout: signOut,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
