
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth as useAuthHook } from "@/hooks/useAuth";

// Create a context for authentication with the hook
export const AuthContext = createContext(null);

// Export the hook for accessing auth context
export const useAuthContext = () => useContext(AuthContext);

// Export the AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authUtils = useAuthHook();
  
  return (
    <AuthContext.Provider value={authUtils}>
      {children}
    </AuthContext.Provider>
  );
};
