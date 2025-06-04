
import React, { createContext, useContext } from 'react';
import { usePermissions } from '@/hooks/security/usePermissions';
import type { Permission } from '@/hooks/security/usePermissions';

interface SecurityContextType {
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  isAdmin: boolean;
  loading: boolean;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isAdmin, loading } = usePermissions();

  const value = {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    loading,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};
