
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
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="beauty-app-theme">
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
          <Toaster position="top-right" />
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
