
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { useLoading } from './LoadingContext';
import { handleError } from '@/utils/errorHandler';
import { supabase } from '@/integrations/supabase/client';
import { executeParallel, fetchWithCache } from '@/utils/cacheUtils';

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
  healthStatus: {
    database: boolean;
    auth: boolean;
    tenant: boolean;
    business: boolean;
  };
}

const AppInitContext = createContext<AppInitContextType | undefined>(undefined);

// Define initialization steps
const initSteps: InitStep[] = [
  { id: 'auth', name: 'Autenticação', critical: true },
  { id: 'config', name: 'Configurações', critical: false },
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
  const [healthStatus, setHealthStatus] = useState({
    database: false,
    auth: false,
    tenant: false,
    business: false
  });
  
  const { user, loading: authLoading } = useAuth();
  const { businessId: currentBusinessId, loading: businessLoading } = useCurrentBusiness();
  const { 
    setStage, 
    finishLoading, 
    setError, 
    allowContinueDespiteErrors, 
    setAllowContinueDespiteErrors,
    bypassConnectivityCheck
  } = useLoading();
  
  // Check for emergency continue flags
  useEffect(() => {
    const hasInitErrors = localStorage.getItem('app_init_errors') === 'true';
    if (hasInitErrors) {
      console.log("Detected app_init_errors flag, will attempt to continue despite errors");
      setAllowContinueDespiteErrors(true);
    }
  }, [setAllowContinueDespiteErrors]);
  
  // Check database connection with timeout and bypass option
  const checkDatabaseConnection = async (): Promise<boolean> => {
    // If bypass is enabled, return true without checking
    if (bypassConnectivityCheck) {
      console.log("Bypassing database connection check due to flag");
      return true;
    }
    
    try {
      const cacheKey = 'health_check_db';
      return await fetchWithCache(
        cacheKey,
        async () => {
          try {
            // Add timeout to the database check
            const timeoutPromise = new Promise<boolean>((_, reject) => {
              setTimeout(() => reject(new Error("Database connection timeout")), 5000);
            });
            
            // Properly handle the Supabase query with timeout
            const queryPromise = async () => {
              const response = await supabase
                .from('negocios')
                .select('id')
                .limit(1);
                
              const { data, error } = response;
              return !error && Array.isArray(data);
            };
            
            // Race between timeout and actual query
            return await Promise.race([queryPromise(), timeoutPromise]);
          } catch (err) {
            console.warn("Database check failed with timeout or error:", err);
            return false;
          }
        },
        5, // Cache for 5 minutes
        bypassConnectivityCheck // Force refresh if bypass is enabled
      );
    } catch (error) {
      console.warn("Database connection check failed:", error);
      // If we have bypass enabled or allow continue despite errors, don't fail
      return bypassConnectivityCheck || allowContinueDespiteErrors;
    }
  };

  // Helper function to load user data with timeout
  const loadUserData = async (userId: string) => {
    try {
      const cacheKey = `user_data_${userId}`;
      return await fetchWithCache(
        cacheKey,
        async () => {
          const response = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
          
          const { data, error } = response;
          if (error) throw error;
          return data;
        },
        15 // Cache for 15 minutes
      );
    } catch (error) {
      console.error("Failed to load user data:", error);
      return null;
    }
  };
  
  // Simplified tenant context setting with better error handling
  const trySetTenantContext = async (id: string): Promise<boolean> => {
    if (!id) return false;
    
    try {
      // Add timeout to RPC call to prevent hanging
      const timeoutPromise = new Promise<boolean>((_, reject) => {
        setTimeout(() => reject(new Error("set_tenant_context timeout")), 3000);
      });
      
      const rpcPromise = async () => {
        try {
          // Properly await the Supabase RPC call
          const response = await supabase
            .rpc('set_tenant_context', { tenant_id: id });
          
          return !response.error;
        } catch (e) {
          console.warn("RPC call failed:", e);
          return false;
        }
      };
      
      // Use race to implement timeout
      return await Promise.race([rpcPromise(), timeoutPromise]);
    } catch (error) {
      console.warn("Failed to set tenant context:", error);
      // Not critical, so return true if we're in emergency mode
      return allowContinueDespiteErrors || bypassConnectivityCheck;
    }
  };
  
  // Main initialization function with improved error handling
  useEffect(() => {
    // Improved initialization process with retries and fallbacks
    async function initialize() {
      try {
        // Skip initialization if already completed
        if (initialized) return;
        
        // Step 1: Check authentication
        setStage('auth');
        if (authLoading) {
          // Wait for auth to complete
          return;
        }
        
        // Update health status for auth
        setHealthStatus(prev => ({ ...prev, auth: true }));
        
        if (!user) {
          // Authentication failed or user is not logged in
          // This is handled by the RequireAuth component, so we can proceed
          finishLoading();
          setInitialized(true);
          return;
        }
        
        // Step 2: Run health checks in parallel if not bypassed
        setStage('config');
        
        // Only run database check if not bypassed
        if (!bypassConnectivityCheck) {
          const healthChecks = await executeParallel([
            { 
              key: 'database', 
              promise: () => checkDatabaseConnection(),
              timeoutMs: 5000
            }
          ]);
          
          setHealthStatus(prev => ({
            ...prev,
            database: Boolean(healthChecks.database.data)
          }));
          
          if (!healthChecks.database.data && !allowContinueDespiteErrors && !bypassConnectivityCheck) {
            throw new Error("Database connection check failed");
          }
        } else {
          // If bypassed, just set database health to true
          setHealthStatus(prev => ({ ...prev, database: true }));
        }
        
        // Step 3: Load user data with fallback
        setStage('user_data');
        const userData = await loadUserData(user.id);
        if (userData) {
          console.log("User data loaded successfully");
        } else {
          console.warn('Não foi possível carregar dados do usuário, mas continuando...');
          // Continue anyway, as we have the user from auth
        }
        
        // Step 4: Load business data with fallback
        setStage('business_data');
        if (businessLoading) {
          // Wait for business data to load
          return;
        }
        
        if (currentBusinessId) {
          setBusinessId(currentBusinessId);
          setTenantId(currentBusinessId); // Assume tenant_id = business_id
          
          // Update health status
          setHealthStatus(prev => ({ ...prev, business: true }));
          
          // Try to set tenant context but don't fail if it doesn't work
          const tenantSuccess = await trySetTenantContext(currentBusinessId);
          setHealthStatus(prev => ({ ...prev, tenant: tenantSuccess }));
        } else if (allowContinueDespiteErrors || bypassConnectivityCheck) {
          // In emergency mode, try to get business ID from cache
          const cachedBusinessId = localStorage.getItem('currentBusinessId');
          if (cachedBusinessId) {
            console.log("Using cached business ID in emergency mode:", cachedBusinessId);
            setBusinessId(cachedBusinessId);
            setTenantId(cachedBusinessId);
            setHealthStatus(prev => ({ ...prev, business: true }));
            
            // Try to set tenant context but don't fail
            await trySetTenantContext(cachedBusinessId);
          }
        }
        
        // All done - even if some parts failed, we want to complete in emergency mode
        finishLoading();
        setInitialized(true);
      } catch (error: any) {
        console.error("Initialization error:", error);
        
        // Only show error if we're not in emergency mode
        if (!allowContinueDespiteErrors && !bypassConnectivityCheck) {
          const appError = handleError('AppInit', error, false);
          
          setErrors(prev => ({ 
            ...prev, 
            [appError.type]: appError 
          }));
          
          setError(appError);
        } else {
          // In emergency mode, continue despite errors
          console.warn("Continuing despite initialization error due to emergency mode");
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
    allowContinueDespiteErrors,
    bypassConnectivityCheck,
    errors,
    setStage,
    finishLoading,
    setError
  ]);

  return (
    <AppInitContext.Provider
      value={{
        initialized,
        errors,
        businessId,
        tenantId,
        healthStatus
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
