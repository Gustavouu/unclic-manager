
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
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
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public routes */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />

              {/* Protected routes */}
              <Route
                path="/*"
                element={
                  <RequireAuth>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<DashboardEnhanced />} />
                        <Route path="/appointments/*" element={<AppointmentsPage />} />
                        <Route path="/clients/*" element={<ClientsPage />} />
                        <Route path="/services/*" element={<ServicesPage />} />
                        <Route path="/professionals/*" element={<ProfessionalsPage />} />
                        <Route path="/inventory/*" element={<InventoryPage />} />
                        <Route path="/finance/*" element={<FinancePage />} />
                        <Route path="/payments/*" element={<PaymentsPage />} />
                        <Route path="/reports/*" element={<ReportsPage />} />
                        <Route path="/marketing/*" element={<MarketingPage />} />
                        <Route path="/documents/*" element={<DocumentsPage />} />
                        <Route path="/settings/*" element={<SettingsPage />} />
                      </Routes>
                    </Layout>
                  </RequireAuth>
                }
              />
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
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
