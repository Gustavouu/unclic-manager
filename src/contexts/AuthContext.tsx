
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

// Re-export the AuthProvider directly from the useAuth hook
export const { AuthProvider } = useAuth;

// Also export the context and hook for easier access elsewhere
export const AuthContext = useAuth.context;
export const useAuthContext = useAuth.useAuthContext;
