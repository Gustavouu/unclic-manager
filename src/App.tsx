
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { Layout } from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Appointments from '@/pages/Appointments';
import Clients from '@/pages/Clients';
import Services from '@/pages/Services';
import Professionals from '@/pages/Professionals';
import Inventory from '@/pages/Inventory';
import Finance from '@/pages/Finance';
import Payments from '@/pages/Payments';
import ReportsPage from '@/pages/ReportsPage';
import Settings from '@/pages/Settings';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { initializeGlobalErrorHandler } from '@/services/error/GlobalErrorHandler';
import './App.css';

// Inicializar o manipulador de erros global
initializeGlobalErrorHandler();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (renamed from cacheTime)
      retry: (failureCount, error: any) => {
        // Não tentar novamente para erros 4xx (exceto 401/403)
        if (error?.status >= 400 && error?.status < 500 && ![401, 403].includes(error?.status)) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false, // Não tentar novamente mutations automaticamente
    },
  },
});

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="beauty-app-theme">
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/services" element={<Services />} />
                <Route path="/professionals" element={<Professionals />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
            <Toaster position="top-right" richColors closeButton />
          </Router>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
