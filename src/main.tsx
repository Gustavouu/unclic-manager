
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";
import App from "./App";
import { AuthProvider } from "./hooks/useAuth";
import { TenantProvider } from "./contexts/TenantContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import { initializeEnv } from "./lib/env";

// Initialize environment validation
try {
  initializeEnv();
} catch (error) {
  console.error("Failed to initialize environment:", error);
  // We could show an error screen here, but for now we'll just log the error
}

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="unclic-theme">
        <QueryClientProvider client={queryClient}>
          <LoadingProvider>
            <AuthProvider>
              <TenantProvider>
                <App />
                <Toaster position="top-right" richColors />
              </TenantProvider>
            </AuthProvider>
          </LoadingProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
