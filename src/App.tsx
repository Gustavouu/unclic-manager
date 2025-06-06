
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { TenantProvider } from '@/contexts/TenantContext';
import { Toaster } from 'sonner';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';

// Pages
import AuthPremium from '@/pages/AuthPremium';
import Dashboard from '@/pages/Dashboard';
import Clients from '@/pages/Clients';
import Appointments from '@/pages/Appointments';
import Finance from '@/pages/Finance';
import Settings from '@/pages/Settings';
import Services from '@/pages/Services';
import Professionals from '@/pages/Professionals';
import Inventory from '@/pages/Inventory';
import Payments from '@/pages/Payments';
import Reports from '@/pages/Reports';
import Marketing from '@/pages/Marketing';
import Documents from '@/pages/Documents';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TenantProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Routes>
                {/* Public Routes */}
                <Route path="/auth" element={<AuthPremium />} />
                
                {/* Protected Routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/clients" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Clients />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/appointments" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Appointments />
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/services" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Services />
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/professionals" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Professionals />
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/inventory" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Inventory />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/financial" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Finance />
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/payments" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Payments />
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/reports" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Reports />
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/marketing" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Marketing />
                    </AppLayout>
                  </ProtectedRoute>
                } />

                <Route path="/documents" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Documents />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Settings />
                    </AppLayout>
                  </ProtectedRoute>
                } />

                {/* Redirect to auth for any unmatched routes */}
                <Route path="*" element={<Navigate to="/auth" replace />} />
              </Routes>
              
              <Toaster 
                position="top-right" 
                richColors 
                closeButton
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '14px',
                  },
                }}
              />
            </div>
          </Router>
        </TenantProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
