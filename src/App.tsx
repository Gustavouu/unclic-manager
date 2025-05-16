
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/auth/AuthContext';
import { ThemeProvider } from './providers/ThemeProvider';
import { CacheProvider } from './providers/CacheProvider';
import { ProtectedRoute } from './components/ui/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login'; // Updated path to correct location
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import OnboardingPage from './pages/Onboarding';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CacheProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route
                path="/"
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster position="top-right" />
        </CacheProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
