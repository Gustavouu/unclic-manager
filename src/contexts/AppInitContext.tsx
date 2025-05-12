
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { useLoading } from './LoadingContext';
import { handleError, ErrorType } from '@/utils/errorHandler';
import { supabase } from '@/integrations/supabase/client';

interface InitStep {
  id: string;
  name: string;
  critical: boolean;
}

interface AppInitContextType {
  initialized: boolean;
  errors: Record<string, any>;
  businessId: string | null;
  tenantId: string | null;
}

const AppInitContext = createContext<AppInitContextType | undefined>(undefined);

// Define initialization steps
const initSteps: InitStep[] = [
  { id: 'auth', name: 'Autenticação', critical: true },
  { id: 'config', name: 'Configurações', critical: true },
  { id: 'user_data', name: 'Dados do usuário', critical: false },
  { id: 'business_data', name: 'Dados do negócio', critical: false },
];

interface AppInitProviderProps {
  children: ReactNode;
}

export function AppInitProvider({ children }: AppInitProviderProps) {
  const [initialized, setInitialized] = useState(false);
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [initAttempt, setInitAttempt] = useState(0);
  
  const { user, loading: authLoading } = useAuth();
  const { businessId: currentBusinessId, loading: businessLoading } = useCurrentBusiness();
  const { setStage, finishLoading, setError } = useLoading();
  
  // Main initialization function
  useEffect(() => {
    // Function to handle initialization process with timeouts and retries
    async function initialize() {
      try {
        // Step 1: Check authentication
        setStage('auth');
        if (authLoading) {
          // Wait for auth to complete
          return;
        }
        
        if (!user) {
          // Authentication failed or user is not logged in
          // This is handled by the RequireAuth component, so we can proceed
          finishLoading();
          setInitialized(true);
          return;
        }
        
        // Step 2: Load configurations
        setStage('config');
        try {
          const dbConnectionOk = await checkDatabaseConnection();
          if (!dbConnectionOk) {
            console.warn("Database connection check failed, but continuing anyway");
            // Continue anyway, as this might not be critical
          }
        } catch (error) {
          console.warn("Database connection check error:", error);
          // Continue anyway, as this might not be critical
        }
        
        // Step 3: Load user data
        setStage('user_data');
        try {
          const userData = await loadUserData(user.id);
          if (!userData) {
            console.warn('Não foi possível carregar dados do usuário, mas continuando...');
            // Continue anyway, as we have the user from auth
          }
        } catch (error) {
          console.warn('Erro ao carregar dados do usuário:', error);
          // Continue anyway, as this might not be critical
        }
        
        // Step 4: Load business data
        setStage('business_data');
        if (businessLoading) {
          // Wait for business data to load
          return;
        }
        
        if (currentBusinessId) {
          setBusinessId(currentBusinessId);
          setTenantId(currentBusinessId); // Assume tenant_id = business_id
          
          // Set tenant context in Supabase with better error handling and timeout
          try {
            await Promise.race([
              // Actual RPC call
              (async () => {
                try {
                  console.log("Setting tenant context for business ID:", currentBusinessId);
                  const { error } = await supabase.rpc('set_tenant_context', { 
                    tenant_id: currentBusinessId 
                  });
                  
                  if (error) {
                    console.warn("Failed to set tenant context:", error);
                  }
                } catch (error) {
                  console.warn("Exception in set_tenant_context:", error);
                }
              })(),
              
              // Timeout
              new Promise(resolve => setTimeout(() => {
                console.warn("set_tenant_context timed out, continuing anyway");
                resolve(null);
              }, 3000))
            ]);
          } catch (error) {
            console.warn("Failed to set tenant context with error:", error);
            // Continue anyway as this might not be critical
          }
        }
        
        // All done
        finishLoading();
        setInitialized(true);
        
        // Reset init attempt counter after successful initialization
        setInitAttempt(0);
      } catch (error) {
        const appError = handleError('AppInit', error);
        
        setErrors(prev => ({ 
          ...prev, 
          [appError.type]: appError 
        }));
        
        setError(appError);
        
        // If we haven't tried too many times already, try again
        if (initAttempt < 3) {
          console.log(`Initialization attempt ${initAttempt + 1}/3 failed, retrying...`);
          setInitAttempt(prev => prev + 1);
          // Wait before retrying with exponential backoff
          setTimeout(() => {
            if (!initialized && !Object.keys(errors).length) {
              initialize();
            }
          }, Math.pow(2, initAttempt) * 1000);
        } else {
          console.warn("Max initialization attempts reached, forcing completion");
          // Even with errors, we'll still try to initialize
          // to prevent the app from being completely blocked
          finishLoading();
          setInitialized(true);
        }
      }
    }

    if (!initialized && !Object.keys(errors).length) {
      initialize();
    }
  }, [
    user, 
    authLoading, 
    businessLoading, 
    currentBusinessId, 
    initialized,
    initAttempt
  ]);

  // Helper function to check database connection with timeout
  const checkDatabaseConnection = async (): Promise<boolean> => {
    try {
      // Set a timeout for the database check
      const timeoutPromise = new Promise<{data: null, error: Error}>(
        (_, reject) => setTimeout(() => reject(new Error("Database check timeout")), 5000)
      );
      
      const queryPromise = supabase
        .from('negocios')
        .select('id')
        .limit(1);
      
      // Use Promise.race to implement timeout
      const { error } = await Promise.race([queryPromise, timeoutPromise]);
      
      if (error) {
        console.error("Database connection check failed:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.warn("Database connection check failed:", error);
      // Even if the check fails, we'll return true to continue initialization
      return true;
    }
  };

  // Helper function to load user data with timeout
  const loadUserData = async (userId: string) => {
    try {
      // Set a timeout for the user data retrieval
      const timeoutPromise = new Promise<{data: null, error: Error}>(
        (_, reject) => setTimeout(() => reject(new Error("User data load timeout")), 5000)
      );
      
      const queryPromise = supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      // Use Promise.race to implement timeout
      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Failed to load user data:", error);
      // Instead of throwing, we'll return null and let the caller decide what to do
      return null;
    }
  };

  return (
    <AppInitContext.Provider
      value={{
        initialized,
        errors,
        businessId,
        tenantId
      }}
    >
      {children}
    </AppInitContext.Provider>
  );
}

export function useAppInit() {
  const context = useContext(AppInitContext);
  
  if (context === undefined) {
    throw new Error('useAppInit must be used within an AppInitProvider');
  }
  
  return context;
}
