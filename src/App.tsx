
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './providers/ThemeProvider';
import { CacheProvider } from './providers/CacheProvider';
import { ProtectedRoute } from './components/ui/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ResetPassword from './pages/auth/ResetPassword';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import OnboardingPage from './pages/Onboarding';
import Index from './pages/Index';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CacheProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected routes */}
            <Route path="/" element={<Index />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-right" />
        </CacheProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
