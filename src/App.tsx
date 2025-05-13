import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider"
import Index from './pages/Index';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ResetPasswordConfirmation from './pages/auth/ResetPasswordConfirmation';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import SelectTenant from './pages/SelectTenant';
import AccessDenied from './pages/AccessDenied';
import ErrorPage from './pages/Error';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import { RequireAuth } from './components/auth/RequireAuth';
import { AuthProvider } from './hooks/useAuth';
import { TenantProvider } from './contexts/TenantContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastProvider } from "@/components/ui/use-toast"
import { QueryClient, QueryClientProvider } from 'react-query';
import { SessionProvider } from "@/contexts/SessionContext";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="unclic-ui-theme">
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <AuthProvider>
            <TenantProvider>
              <LoadingProvider>
                <NotificationProvider>
                  <ToastProvider>
                    <Router>
                      <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/reset-password-confirmation" element={<ResetPasswordConfirmation />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-of-service" element={<TermsOfService />} />
                        
                        <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
                        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
                        <Route path="/onboarding" element={<RequireAuth skipOnboardingCheck={true}><Onboarding /></RequireAuth>} />
                        <Route path="/select-tenant" element={<RequireAuth skipOnboardingCheck={true}><SelectTenant /></RequireAuth>} />
                        <Route path="/access-denied" element={<RequireAuth skipOnboardingCheck={true}><AccessDenied /></RequireAuth>} />
                        <Route path="/error" element={<ErrorPage />} />
                      </Routes>
                    </Router>
                  </ToastProvider>
                </NotificationProvider>
              </LoadingProvider>
            </TenantProvider>
          </AuthProvider>
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
