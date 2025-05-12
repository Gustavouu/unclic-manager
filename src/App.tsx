
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from "@/lib/react-query-utils";
import { Toaster } from "sonner";
import { AuthProvider } from "@/hooks/useAuth";
import { TenantProvider } from "@/contexts/TenantContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { AppInitProvider } from "@/contexts/AppInitContext";
import { AppRoutes } from "./routes/LazyRoutes";
import { StatusFixButton } from "@/components/dashboard/StatusFixButton";

import "@/styles/globals.css";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LoadingProvider>
          <TenantProvider>
            <AppInitProvider>
              <Toaster position="top-right" richColors />
              <AppRoutes />
              <StatusFixButton />
            </AppInitProvider>
          </TenantProvider>
        </LoadingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
