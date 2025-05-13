
import { createContext, useContext, useState, ReactNode } from "react";

interface TenantContextType {
  currentTenantId: string | null;
  setCurrentTenantId: (id: string | null) => void;
}

const TenantContext = createContext<TenantContextType>({
  currentTenantId: null,
  setCurrentTenantId: () => {},
});

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(
    localStorage.getItem("currentBusinessId")
  );

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
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
