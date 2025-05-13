
import { createContext, useContext, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { useSessionManager } from '@/hooks/useSessionManager';

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
  loading: false,
  refreshToken: async () => {},
  invalidateSession: async () => false,
  getActiveSessions: async () => ({ data: null, error: 'Context not initialized' }),
});

export const useSession = () => useContext(SessionContext);

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const sessionManager = useSessionManager();

  return (
    <SessionContext.Provider value={sessionManager}>
      {children}
    </SessionContext.Provider>
  );
};
