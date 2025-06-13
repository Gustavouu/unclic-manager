
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryProvider } from './contexts/QueryContext';
import { ErrorHandlingProvider } from './contexts/ErrorHandlingContext';
import { AuthProvider } from './contexts/AuthContext';
import { RequireAuth } from './components/auth/RequireAuth';
import { OnboardingRedirect } from './components/auth/OnboardingRedirect';
import { DashboardLayout } from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Services from './pages/Services';
import Professionals from './pages/Professionals';
import Bookings from './pages/Bookings';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Index from './pages/Index';
import OnboardingPage from './pages/Onboarding';
import OnboardingFixedPage from './pages/OnboardingFixed';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MultiTenantProvider } from '@/contexts/MultiTenantContext';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryProvider>
          <ErrorHandlingProvider>
            <AuthProvider>
              <div className="min-h-screen bg-background">
                <Routes>
                  {/* Root route - handles authentication check and redirects */}
                  <Route path="/" element={<Index />} />
                  
                  {/* Public routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Onboarding routes - protected but outside main layout */}
                  <Route 
                    path="/onboarding" 
                    element={
                      <RequireAuth>
                        <OnboardingPage />
                      </RequireAuth>
                    } 
                  />
                  <Route 
                    path="/onboarding-fixed" 
                    element={
                      <RequireAuth>
                        <OnboardingFixedPage />
                      </RequireAuth>
                    } 
                  />
                  
                  {/* Protected routes with layout and onboarding check */}
                  <Route 
                    path="/*" 
                    element={
                      <RequireAuth>
                        <MultiTenantProvider>
                          <OnboardingRedirect>
                            <DashboardLayout />
                          </OnboardingRedirect>
                        </MultiTenantProvider>
                      </RequireAuth>
                    }
                  >
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="clients" element={<Clients />} />
                    <Route path="services" element={<Services />} />
                    <Route path="professionals" element={<Professionals />} />
                    <Route path="bookings" element={<Bookings />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                  
                  {/* Redirect any unknown routes to root */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Toaster />
              </div>
            </AuthProvider>
          </ErrorHandlingProvider>
        </QueryProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
