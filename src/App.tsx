
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TenantProvider } from "@/contexts/TenantContext";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Services from "./pages/Services";
import Appointments from "./pages/Appointments";
import Finance from "./pages/Finance";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <TenantProvider>
              <div className="min-h-screen bg-background">
                <Toaster />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                  <Route path="/clients" element={<Layout><Clients /></Layout>} />
                  <Route path="/services" element={<Layout><Services /></Layout>} />
                  <Route path="/appointments" element={<Layout><Appointments /></Layout>} />
                  <Route path="/professionals" element={<Layout><div className="p-6">Profissionais - Em desenvolvimento</div></Layout>} />
                  <Route path="/finance" element={<Layout><Finance /></Layout>} />
                  <Route path="/reports" element={<Layout><div className="p-6">Relatórios - Em desenvolvimento</div></Layout>} />
                  <Route path="/settings" element={<Layout><div className="p-6">Configurações - Em desenvolvimento</div></Layout>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </TenantProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
