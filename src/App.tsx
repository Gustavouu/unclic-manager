
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { RequireAuth } from '@/components/auth/RequireAuth';
import AuthPage from '@/pages/Auth';

// Import pages
import DashboardEnhanced from '@/pages/DashboardEnhanced';
import AppointmentsPage from '@/pages/Appointments';
import ClientsPage from '@/pages/Clients';
import ServicesPage from '@/pages/Services';
import ProfessionalsPage from '@/pages/Professionals';
import InventoryPage from '@/pages/Inventory';
import FinancePage from '@/pages/Finance';
import PaymentsPage from '@/pages/Payments';
import ReportsPage from '@/pages/Reports';
import MarketingPage from '@/pages/Marketing';
import DocumentsPage from '@/pages/Documents';
import SettingsPage from '@/pages/Settings';
import OnboardingPage from '@/pages/Onboarding';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" enableSystem>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public routes - não precisam de autenticação */}
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />

                {/* Protected routes - precisam de autenticação */}
                <Route
                  path="/dashboard"
                  element={
                    <RequireAuth>
                      <Layout>
                        <DashboardEnhanced />
                      </Layout>
                    </RequireAuth>
                  }
                />
                
                <Route
                  path="/appointments/*"
                  element={
                    <RequireAuth>
                      <Layout>
                        <AppointmentsPage />
                      </Layout>
                    </RequireAuth>
                  }
                />
                
                <Route
                  path="/clients/*"
                  element={
                    <RequireAuth>
                      <Layout>
                        <ClientsPage />
                      </Layout>
                    </RequireAuth>
                  }
                />
                
                <Route
                  path="/services/*"
                  element={
                    <RequireAuth>
                      <Layout>
                        <ServicesPage />
                      </Layout>
                    </RequireAuth>
                  }
                />
                
                <Route
                  path="/professionals/*"
                  element={
                    <RequireAuth>
                      <Layout>
                        <ProfessionalsPage />
                      </Layout>
                    </RequireAuth>
                  }
                />
                
                <Route
                  path="/inventory/*"
                  element={
                    <RequireAuth>
                      <Layout>
                        <InventoryPage />
                      </Layout>
                    </RequireAuth>
                  }
                />
                
                <Route
                  path="/finance/*"
                  element={
                    <RequireAuth>
                      <Layout>
                        <FinancePage />
                      </Layout>
                    </RequireAuth>
                  }
                />
                
                <Route
                  path="/payments/*"
                  element={
                    <RequireAuth>
                      <Layout>
                        <PaymentsPage />
                      </Layout>
                    </RequireAuth>
                  }
                />
                
                <Route
                  path="/reports/*"
                  element={
                    <RequireAuth>
                      <Layout>
                        <ReportsPage />
                      </Layout>
                    </RequireAuth>
                  }
                />
                
                <Route
                  path="/marketing/*"
                  element={
                    <RequireAuth>
                      <Layout>
                        <MarketingPage />
                      </Layout>
                    </RequireAuth>
                  }
                />
                
                <Route
                  path="/documents/*"
                  element={
                    <RequireAuth>
                      <Layout>
                        <DocumentsPage />
                      </Layout>
                    </RequireAuth>
                  }
                />
                
                <Route
                  path="/settings/*"
                  element={
                    <RequireAuth>
                      <Layout>
                        <SettingsPage />
                      </Layout>
                    </RequireAuth>
                  }
                />

                {/* Redirect root to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>

              <Toaster 
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: 'hsl(var(--background))',
                    color: 'hsl(var(--foreground))',
                    border: '1px solid hsl(var(--border))',
                  },
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
