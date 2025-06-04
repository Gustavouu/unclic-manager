
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { OptimizedLayout } from '@/components/layout/OptimizedLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Toaster } from 'sonner';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import OptimizedDashboard from '@/pages/OptimizedDashboard';
import Onboarding from '@/pages/Onboarding';
import OnboardingFixed from '@/pages/OnboardingFixed';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } />
            <Route path="/onboarding-fixed" element={
              <ProtectedRoute>
                <OnboardingFixed />
              </ProtectedRoute>
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <OptimizedLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Index />} />
              <Route path="dashboard" element={<OptimizedDashboard />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
          <Toaster position="top-right" />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
