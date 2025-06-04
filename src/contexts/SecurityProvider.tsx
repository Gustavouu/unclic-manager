
import React, { ReactNode } from 'react';
import { usePermissions } from '@/hooks/security/usePermissions';
import { SecurityContext } from '@/hooks/security/useSecurityContext';

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider = ({ children }: SecurityProviderProps) => {
  const { 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions, 
    isAdmin, 
    loading 
  } = usePermissions();

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
