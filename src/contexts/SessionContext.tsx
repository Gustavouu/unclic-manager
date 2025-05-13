
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface SessionContextType {
  session: Session | null;
  loading: boolean;
  refreshToken: () => Promise<void>;
  invalidateSession: (sessionId: string) => Promise<boolean>;
  getActiveSessions: () => Promise<any>;
}

// Default context values
const SessionContext = createContext<SessionContextType>({
  session: null,
  loading: true,
  refreshToken: async () => {},
  invalidateSession: async () => false,
  getActiveSessions: async () => ({ data: null, error: 'Context not initialized' }),
});

export const useSession = () => useContext(SessionContext);

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    async function getInitialSession() {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    }

    getInitialSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Refresh the session's access token
  const refreshToken = async (): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      setSession(data.session);
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  };

  // Invalidate a specific session
  const invalidateSession = async (sessionId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.rpc('revoke_session', { session_id: sessionId });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error invalidating session:', error);
      return false;
    }
  };

  // Get all active sessions for the current user
  const getActiveSessions = async () => {
    try {
      return await supabase.rpc('get_active_sessions');
    } catch (error) {
      console.error('Error getting active sessions:', error);
      return { data: null, error };
    }
  };

  return (
    <SessionContext.Provider value={{
      session,
      loading,
      refreshToken,
      invalidateSession,
      getActiveSessions
    }}>
      {children}
    </SessionContext.Provider>
  );
};
