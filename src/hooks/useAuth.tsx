import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: (options?: { fromAll?: boolean }) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

// Use this hook to access auth functionality
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Set up auth state listener
  useEffect(() => {
    // First set up the auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, sessionData) => {
        setSession(sessionData);
        setUser(sessionData?.user ?? null);
        setLoading(false);
      }
    );

    // Then get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

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

  const logSuspiciousActivity = async (type: string, details: any) => {
    try {
      await supabase.from('security_events').insert({
        user_id: user?.id,
        event_type: type,
        details,
        ip_address: null, // Will be populated by server
        user_agent: navigator.userAgent
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const isSuspicious = trackLoginAttempt(email, false);
        if (isSuspicious) {
          await logSuspiciousActivity('multiple_failed_logins', { email });
        }
        throw error;
      }

      // Reset failed attempts on successful login
      trackLoginAttempt(email, true);

      // Record login event
      try {
        await supabase.from('login_history').insert({
          user_id: data.user?.id,
          success: true,
          ip_address: null, // Will be populated by server
          user_agent: navigator.userAgent,
          device_info: {
            platform: navigator.platform,
            language: navigator.language,
            screen: {
              width: window.screen.width,
              height: window.screen.height
            }
          }
        });
      } catch (logError) {
        console.error("Error logging login history:", logError);
      }
    } catch (error: any) {
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
          data: userData,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signOut = async (options?: { fromAll?: boolean }) => {
    try {
      // Clear business ID from localStorage
      localStorage.removeItem('currentBusinessId');
      
      // Sign out from all devices if requested
      const { error } = await supabase.auth.signOut({
        scope: options?.fromAll ? 'global' : undefined
      });
      
      if (error) {
        throw error;
      }
      
      // Redirect to login
      window.location.href = '/login';
    } catch (error: any) {
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
    } catch (error: any) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Apply rate limiting for password resets - max 3 attempts per hour
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
    } catch (error: any) {
      console.error("Error resetting password:", error);
      throw error;
    }
  };
  
  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) throw error;
      
      toast.success("Senha atualizada com sucesso!");
    } catch (error: any) {
      console.error("Error updating password:", error);
      throw error;
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    updatePassword
  };
};

// Export the hook directly
export default useAuth;
