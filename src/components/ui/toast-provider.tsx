
import React from "react";
import { Toaster } from "sonner";
import { useTheme } from "../theme-provider";

export interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const { theme } = useTheme();
  
  return (
    <>
      <Toaster 
        position="top-right" 
        richColors 
        closeButton 
        theme={theme as "light" | "dark" | "system"}
      />
      {children}
    </>
  );
}
