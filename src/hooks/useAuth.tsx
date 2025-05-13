
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Set up auth state listener
  useEffect(() => {
    // First set up the auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event);
        
        // Only update session/user when they actually change
        setSession(prev => {
          const sessionChanged = 
            (!prev && newSession) || 
            (prev && !newSession) || 
            (prev?.user?.id !== newSession?.user?.id);
            
          if (sessionChanged) {
            setUser(newSession?.user ?? null);
            setLoading(false);
            
            // Log the event for debugging
            if (event === 'SIGNED_IN') {
              console.log('User signed in:', newSession?.user?.id);
            } else if (event === 'SIGNED_OUT') {
              console.log('User signed out');
              // Clear business ID from localStorage when signing out
              localStorage.removeItem('currentBusinessId');
            }
          }
          
          return sessionChanged ? newSession : prev;
        });
      }
    );

    // Then get initial session
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (err) {
        console.error('Error getting session:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Monitor for suspicious activity
  const [loginAttempts, setLoginAttempts] = useState<Record<string, { count: number, lastAttempt: number }>>({});

  const trackLoginAttempt = (email: string, success: boolean): boolean => {
    const now = Date.now();
    const attempts = loginAttempts[email] || { count: 0, lastAttempt: 0 };
    
    // Reset counter after 30 minutes of inactivity
    const updatedCount = (now - attempts.lastAttempt > 30 * 60 * 1000) 
      ? 1 
      : attempts.count + (success ? 0 : 1);
    
    setLoginAttempts(prev => ({
      ...prev,
      [email]: { count: updatedCount, lastAttempt: now }
    }));
    
    // Return true if suspicious (5+ failed attempts)
    return !success && updatedCount >= 5;
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const isSuspicious = trackLoginAttempt(email, false);
        if (isSuspicious) {
          console.warn('Multiple failed login attempts detected:', { email });
        }
        throw error;
      }

      // Reset failed attempts on successful login
      trackLoginAttempt(email, true);
      toast.success("Login realizado com sucesso!");

      return data;
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast.error(error.message || "Erro ao fazer login");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        throw error;
      }

      toast.success("Cadastro realizado com sucesso! Verifique seu email.");
      return data;
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast.error(error.message || "Erro ao criar conta");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (options?: { fromAll?: boolean }) => {
    try {
      setLoading(true);
      // Clear business ID from localStorage
      localStorage.removeItem('currentBusinessId');
      
      // Sign out from all devices if requested
      const { error } = await supabase.auth.signOut({
        scope: options?.fromAll ? 'global' : undefined
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Logout realizado com sucesso!");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error(error.message || "Erro ao fazer logout");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: any) => {
    try {
      setLoading(true);
      if (!user) throw new Error("No user logged in");
      
      const { error } = await supabase.auth.updateUser({
        data: userData
      });
      
      if (error) throw error;
      
      toast.success("Perfil atualizado com sucesso!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Erro ao atualizar perfil");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      // Apply rate limiting for password resets
      const resetKey = `pwd_reset_${email}`;
      const resetAttempts = JSON.parse(sessionStorage.getItem(resetKey) || '{"count":0,"timestamp":0}');
      
      const now = Date.now();
      const hourAgo = now - 60 * 60 * 1000;
      
      // Reset counter if older than an hour
      if (resetAttempts.timestamp < hourAgo) {
        resetAttempts.count = 0;
        resetAttempts.timestamp = now;
      }
      
      // Check limit
      if (resetAttempts.count >= 3) {
        const minutesRemaining = Math.ceil((resetAttempts.timestamp + 60 * 60 * 1000 - now) / (60 * 1000));
        toast.error(`Limite de tentativas excedido`, {
          description: `Tente novamente em ${minutesRemaining} minutos`
        });
        return;
      }
      
      // Increment counter
      resetAttempts.count++;
      resetAttempts.timestamp = Math.max(resetAttempts.timestamp, now);
      sessionStorage.setItem(resetKey, JSON.stringify(resetAttempts));
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password-confirmation',
      });
      
      if (error) throw error;
      
      toast.success("Email de recuperação enviado com sucesso!");
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast.error(error.message || "Erro ao resetar senha");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const updatePassword = async (newPassword: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) throw error;
      
      toast.success("Senha atualizada com sucesso!");
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Erro ao atualizar senha");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check if the user has a business already
  const hasActiveBusiness = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id_negocio')
        .eq('id', user.id)
        .maybeSingle();
        
      if (error) throw error;
      
      return !!data?.id_negocio;
    } catch (error) {
      console.error('Error checking if user has business:', error);
      return false;
    }
  }, [user]);

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    updatePassword,
    hasActiveBusiness
  };
};

// Export the hook directly
export default useAuth;
