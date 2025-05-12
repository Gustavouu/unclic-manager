
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
  
  const { user, loading: authLoading } = useAuth();
  const { businessId: currentBusinessId, loading: businessLoading } = useCurrentBusiness();
  const { setStage, finishLoading, setError } = useLoading();
  
  // Main initialization function
  useEffect(() => {
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
        await checkDatabaseConnection();
        
        // Step 3: Load user data
        setStage('user_data');
        const userData = await loadUserData(user.id);
        if (!userData) {
          throw { 
            type: ErrorType.DATABASE, 
            message: 'Não foi possível carregar dados do usuário' 
          };
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
          
          // Set tenant context in Supabase
          try {
            await supabase.rpc('set_tenant_context', { tenant_id: currentBusinessId });
          } catch (error) {
            console.warn("Failed to set tenant context:", error);
            // Continue anyway as this might not be critical
          }
        }
        
        // All done
        finishLoading();
        setInitialized(true);
      } catch (error) {
        const appError = handleError('AppInit', error);
        
        setErrors(prev => ({ 
          ...prev, 
          [appError.type]: appError 
        }));
        
        setError(appError);
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
    initialized
  ]);

  // Helper function to check database connection
  const checkDatabaseConnection = async () => {
    try {
      const { error } = await supabase
        .from('health_check')
        .select('*')
        .limit(1);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.warn("Health check failed:", error);
      // If it's just the health_check table that doesn't exist, we'll continue
      if (error.message?.includes('relation "health_check" does not exist')) {
        return true;
      }
      throw error;
    }
  };

  // Helper function to load user data
  const loadUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Failed to load user data:", error);
      throw error;
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
