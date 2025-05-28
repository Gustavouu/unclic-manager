import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import App from "./App";
import { AuthProvider } from "./hooks/useAuth";
import { TenantProvider } from "./contexts/TenantContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="unclic-theme">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TenantProvider>
              <App />
              <Toaster />
            </TenantProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
