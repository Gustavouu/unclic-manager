
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import { TenantProvider } from '@/contexts/TenantContext';
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

// Helper function to get breadcrumb based on pathname
const getBreadcrumb = (pathname: string) => {
  const breadcrumbMap: Record<string, { label: string; path?: string }[]> = {
    '/dashboard': [
      { label: "Início", path: "/dashboard" }
    ],
    '/appointments': [
      { label: "Início", path: "/dashboard" },
      { label: "Agendamentos" }
    ],
    '/clients': [
      { label: "Início", path: "/dashboard" },
      { label: "Clientes" }
    ],
    '/services': [
      { label: "Início", path: "/dashboard" },
      { label: "Serviços" }
    ],
    '/professionals': [
      { label: "Início", path: "/dashboard" },
      { label: "Profissionais" }
    ],
    '/inventory': [
      { label: "Início", path: "/dashboard" },
      { label: "Estoque" }
    ],
    '/finance': [
      { label: "Início", path: "/dashboard" },
      { label: "Financeiro" }
    ],
    '/payments': [
      { label: "Início", path: "/dashboard" },
      { label: "Pagamentos" }
    ],
    '/reports': [
      { label: "Início", path: "/dashboard" },
      { label: "Relatórios" }
    ],
    '/settings': [
      { label: "Início", path: "/dashboard" },
      { label: "Configurações" }
    ],
  };

  return breadcrumbMap[pathname] || [];
};

function AppRoutes() {
  const location = useLocation();
  const breadcrumb = getBreadcrumb(location.pathname);

  return (
    <Layout breadcrumb={breadcrumb}>
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
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="beauty-app-theme">
      <AuthProvider>
        <TenantProvider>
          <QueryClientProvider client={queryClient}>
            <Router>
              <AppRoutes />
              <Toaster position="top-right" richColors closeButton />
            </Router>
          </QueryClientProvider>
        </TenantProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
