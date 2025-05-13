
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from "./components/theme-provider"; // Fix import path
import Index from './pages/Index';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp'; // Use available SignUp component
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import NotFound from './pages/NotFound'; // Use available NotFound component
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import { RequireAuth } from './components/auth/RequireAuth';
import { AuthProvider } from './hooks/useAuth';
import { TenantProvider } from './contexts/TenantContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { ToastProvider } from "@/components/ui/toast-provider"; // Fix provider import
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Update import
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
                <ToastProvider>
                  <Router>
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<SignUp />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/not-found" element={<NotFound />} />
                      
                      <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
                      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
                      <Route path="/onboarding" element={<RequireAuth skipOnboardingCheck={true}><Onboarding /></RequireAuth>} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Router>
                </ToastProvider>
              </LoadingProvider>
            </TenantProvider>
          </AuthProvider>
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
