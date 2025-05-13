
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth as useAuthHook } from "@/hooks/useAuth";

// Create a proper type for the auth context
type AuthContextType = ReturnType<typeof useAuthHook>;

// Create a context for authentication with proper typing
export const AuthContext = createContext<AuthContextType | null>(null);

// Export the hook for accessing auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

// Export the AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authUtils = useAuthHook();
  
  return (
    <AuthContext.Provider value={authUtils}>
      {children}
    </AuthContext.Provider>
  );
};
