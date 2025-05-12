
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { useLoading } from './LoadingContext';
import { handleError } from '@/utils/errorHandler';
import { supabase } from '@/integrations/supabase/client';
import { safeExecuteRpc, executeParallel, fetchWithCache } from '@/utils/cacheUtils';

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
  const { setStage, finishLoading, setError, allowContinueDespiteErrors, setAllowContinueDespiteErrors } = useLoading();
  
  // Check for emergency continue flags
  useEffect(() => {
    const hasInitErrors = localStorage.getItem('app_init_errors') === 'true';
    if (hasInitErrors) {
      console.log("Detected app_init_errors flag, will attempt to continue despite errors");
      setAllowContinueDespiteErrors(true);
    }
  }, [setAllowContinueDespiteErrors]);
  
  // Check database connection with timeout
  const checkDatabaseConnection = async (): Promise<boolean> => {
    try {
      const cacheKey = 'health_check_db';
      return await fetchWithCache(
        cacheKey,
        async () => {
          const { success } = await safeExecuteRpc(() => 
            supabase.from('negocios').select('id').limit(1)
          );
          return success;
        },
        5 // Cache for 5 minutes
      );
    } catch (error) {
      console.warn("Database connection check failed:", error);
      return false;
    }
  };

  // Helper function to load user data with timeout
  const loadUserData = async (userId: string) => {
    try {
      const cacheKey = `user_data_${userId}`;
      return await fetchWithCache(
        cacheKey,
        async () => {
          const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
          
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
  
  // Simplified tenant context setting
  const trySetTenantContext = async (id: string): Promise<boolean> => {
    if (!id) return false;
    
    try {
      const { success } = await safeExecuteRpc(() => 
        supabase.rpc('set_tenant_context', { tenant_id: id })
      );
      
      return success;
    } catch (error) {
      console.warn("Failed to set tenant context:", error);
      return false;
    }
  };
  
  // Main initialization function
  useEffect(() => {
    // Function to handle initialization process with timeouts and retries
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
        
        // Step 2: Run health checks in parallel
        setStage('config');
        const healthChecks = await executeParallel([
          { 
            key: 'database', 
            promise: () => checkDatabaseConnection()
          }
        ]);
        
        setHealthStatus(prev => ({
          ...prev,
          database: Boolean(healthChecks.database.data)
        }));
        
        if (!healthChecks.database.data && !allowContinueDespiteErrors) {
          throw new Error("Database connection check failed");
        }
        
        // Step 3: Load user data
        setStage('user_data');
        const userData = await loadUserData(user.id);
        if (userData) {
          console.log("User data loaded successfully");
        } else {
          console.warn('Não foi possível carregar dados do usuário, mas continuando...');
          // Continue anyway, as we have the user from auth
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
          
          // Update health status
          setHealthStatus(prev => ({ ...prev, business: true }));
          
          // Try to set tenant context but don't fail if it doesn't work
          const tenantSuccess = await trySetTenantContext(currentBusinessId);
          setHealthStatus(prev => ({ ...prev, tenant: tenantSuccess }));
        }
        
        // All done
        finishLoading();
        setInitialized(true);
      } catch (error: any) {
        console.error("Initialization error:", error);
        
        // Only show error if we're not in emergency mode
        if (!allowContinueDespiteErrors) {
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
