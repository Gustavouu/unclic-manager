
import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";

interface TenantContextType {
  currentTenantId: string | null;
  setCurrentTenantId: (id: string | null) => void;
  // Add missing properties used across the application
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
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(
    localStorage.getItem("currentBusinessId")
  );

  // Use the current business hook to get additional data and methods
  const {
    businessId,
    businessData: currentBusiness,
    loading,
    error,
    updateBusinessStatus,
    fetchBusinessData: refreshBusinessData
  } = useCurrentBusiness();

  const updateTenantId = (id: string | null) => {
    setCurrentTenantId(id);
    if (id) {
      localStorage.setItem("currentBusinessId", id);
    } else {
      localStorage.removeItem("currentBusinessId");
    }
  };

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
