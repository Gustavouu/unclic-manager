
import React from "react";
import { Toaster } from "sonner";

export interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      {children}
    </>
  );
}
