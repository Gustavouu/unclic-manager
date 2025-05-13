
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Constants for token renewal
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry
const SESSION_CHECK_INTERVAL = 60 * 1000; // Check every minute
const MAX_REFRESH_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

/**
 * Hook to manage session and handle automatic token renewal
 */
export function useSessionManager() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Save session activity
  const recordSessionActivity = useCallback(async (sessionId: string) => {
    try {
      // Record session activity in the database
      await supabase.from('user_sessions').upsert({
        session_id: sessionId,
        user_id: session?.user?.id,
        last_active_at: new Date().toISOString(),
        user_agent: navigator.userAgent,
        ip_address: null, // Will be populated by the server-side middleware
      }, { onConflict: 'session_id' });
    } catch (error) {
      // Non-critical error, log but don't disrupt user experience
      console.error('Failed to record session activity:', error);
    }
  }, [session?.user?.id]);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    if (!session || refreshing) return;

    try {
      setRefreshing(true);
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        throw error;
      }

      if (data?.session) {
        setSession(data.session);
        // Record session activity for the refreshed session
        await recordSessionActivity(data.session.access_token);
        // Reset retry count on success
        setRetryCount(0);
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      
      // Implement retry mechanism
      if (retryCount < MAX_REFRESH_RETRIES) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          setRefreshing(false);
        }, RETRY_DELAY);
      } else {
        // After max retries, notify user and force re-login
        toast.error('Sua sessão expirou.', { 
          description: 'Por favor, faça login novamente.',
          duration: 5000,
        });
        await supabase.auth.signOut();
      }
    } finally {
      setRefreshing(false);
    }
  }, [session, refreshing, retryCount, recordSessionActivity]);

  // Check if token needs refresh
  const checkTokenExpiry = useCallback(() => {
    if (!session) return;

    // Calculate time until token expires
    const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
    const timeUntilExpiry = expiresAt - Date.now();

    // If token expires soon, refresh it
    if (timeUntilExpiry < TOKEN_REFRESH_THRESHOLD) {
      refreshToken();
    }
  }, [session, refreshToken]);

  // Effect to initialize session
  useEffect(() => {
    const initSession = async () => {
      try {
        // Get current session
        const { data } = await supabase.auth.getSession();
        setSession(data.session);

        if (data.session?.access_token) {
          await recordSessionActivity(data.session.access_token);
        }
      } catch (error) {
        console.error('Error initializing session:', error);
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, [recordSessionActivity]);

  // Effect to set up subscription to auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      
      // Record login activity
      if (event === 'SIGNED_IN' && newSession?.access_token) {
        // Using setTimeout to avoid potential Supabase auth deadlocks
        setTimeout(() => {
          recordSessionActivity(newSession.access_token);
        }, 0);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [recordSessionActivity]);

  // Effect to set up periodic token check
  useEffect(() => {
    // Initial check
    checkTokenExpiry();
    
    // Set up interval for regular checks
    const intervalId = setInterval(() => {
      checkTokenExpiry();
    }, SESSION_CHECK_INTERVAL);

    return () => clearInterval(intervalId);
  }, [checkTokenExpiry]);

  // Function to remotely invalidate another session
  const invalidateSession = async (sessionId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('user_sessions')
        .update({ is_active: false, invalidated_at: new Date().toISOString() })
        .eq('session_id', sessionId);
      
      return !error;
    } catch (error) {
      console.error('Error invalidating session:', error);
      return false;
    }
  };

  // Function to get all active sessions for current user
  const getActiveSessions = async () => {
    if (!session?.user) return { data: null, error: 'No active session' };
    
    try {
      return await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .order('last_active_at', { ascending: false });
    } catch (error) {
      console.error('Error fetching active sessions:', error);
      return { data: null, error };
    }
  };

  return { 
    session, 
    loading,
    refreshing,
    invalidateSession,
    getActiveSessions,
    refreshToken 
  };
}
