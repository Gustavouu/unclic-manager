
import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface TenantContextType {
  currentTenantId: string | null;
  setCurrentTenantId: (id: string | null) => void;
  currentBusiness: any;
  businessId: string | null;
  loading: boolean;
  error: string | null;
  updateBusinessStatus: (id: string, status: string) => Promise<boolean>;
  refreshBusinessData: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType>({
  currentTenantId: null,
  setCurrentTenantId: () => {},
  currentBusiness: null,
  businessId: null,
  loading: false,
  error: null,
  updateBusinessStatus: async () => false,
  refreshBusinessData: async () => {}
});

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(() => {
    return localStorage.getItem("currentBusinessId");
  });

  // Use the current business hook to get additional data and methods
  const {
    businessId,
    businessData: currentBusiness,
    loading,
    error,
    updateBusinessStatus,
    fetchBusinessData
  } = useCurrentBusiness();

  // When businessId changes from useCurrentBusiness, sync with currentTenantId
  useEffect(() => {
    if (businessId && businessId !== currentTenantId) {
      console.log('Syncing businessId to currentTenantId:', businessId);
      updateTenantId(businessId);
    }
  }, [businessId]);

  // When user changes (login/logout), check localStorage and sync
  useEffect(() => {
    if (!user) {
      // If user logged out, clear the tenant ID
      updateTenantId(null);
    } else if (!currentTenantId) {
      // If user logged in but no tenant ID, try to get from localStorage
      const storedId = localStorage.getItem("currentBusinessId");
      if (storedId) {
        updateTenantId(storedId);
      }
    }
  }, [user]);

  const updateTenantId = useCallback((id: string | null) => {
    console.log('Updating tenant ID:', id);
    setCurrentTenantId(id);
    
    if (id) {
      localStorage.setItem("currentBusinessId", id);
    } else {
      localStorage.removeItem("currentBusinessId");
    }
  }, []);

  const refreshBusinessData = useCallback(async () => {
    console.log('Refreshing business data...');
    try {
      await fetchBusinessData(true); // true to skip cache
      return Promise.resolve();
    } catch (err) {
      console.error('Error refreshing business data:', err);
      return Promise.reject(err);
    }
  }, [fetchBusinessData]);

  // Log state changes for debugging
  useEffect(() => {
    console.log('TenantContext state updated:', { 
      currentTenantId, 
      businessId, 
      hasBusinessData: !!currentBusiness,
      loading,
      error
    });
  }, [currentTenantId, businessId, currentBusiness, loading, error]);

  return (
    <TenantContext.Provider
      value={{
        currentTenantId,
        setCurrentTenantId: updateTenantId,
        currentBusiness,
        businessId,
        loading,
        error,
        updateBusinessStatus,
        refreshBusinessData
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
