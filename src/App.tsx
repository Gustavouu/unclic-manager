
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TenantProvider } from "@/contexts/TenantContext";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { OnboardingRedirect } from "@/components/auth/OnboardingRedirect";
import { Loader } from "@/components/ui/loader";
import { Layout } from "@/components/layout/Layout";

// Lazy load pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Appointments = lazy(() => import("./pages/Appointments"));
const Clients = lazy(() => import("./pages/Clients"));
const Services = lazy(() => import("./pages/Services"));
const Reports = lazy(() => import("./pages/Reports"));
const Settings = lazy(() => import("./pages/Settings"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const OnboardingFixed = lazy(() => import("./pages/OnboardingFixed"));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader size="lg" text="Carregando..." />
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <TenantProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-gray-50">
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Onboarding routes */}
                    <Route 
                      path="/onboarding" 
                      element={
                        <RequireAuth skipOnboardingCheck>
                          <Onboarding />
                        </RequireAuth>
                      } 
                    />
                    <Route 
                      path="/onboarding-fixed" 
                      element={
                        <RequireAuth skipOnboardingCheck>
                          <OnboardingFixed />
                        </RequireAuth>
                      } 
                    />

                    {/* Protected routes with layout */}
                    <Route
                      path="/*"
                      element={
                        <RequireAuth>
                          <OnboardingRedirect>
                            <Layout>
                              <Routes>
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/appointments" element={<Appointments />} />
                                <Route path="/clients" element={<Clients />} />
                                <Route path="/services" element={<Services />} />
                                <Route path="/reports" element={<Reports />} />
                                <Route path="/settings" element={<Settings />} />
                                
                                {/* Catch all route */}
                                <Route path="*" element={<Navigate to="/dashboard" replace />} />
                              </Routes>
                            </Layout>
                          </OnboardingRedirect>
                        </RequireAuth>
                      }
                    />
                  </Routes>
                </Suspense>
                <Toaster />
              </div>
            </BrowserRouter>
          </TenantProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
