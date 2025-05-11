
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/sonner';
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Clients from "./pages/Clients";
import Reports from "./pages/Reports";
import Finance from "./pages/Finance";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import Professionals from "./pages/Professionals";
import Services from "./pages/Services";
import OnboardingPage from "./pages/Onboarding";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import "./services/InitializationService"; // Import initialization service
import { RequireAuth } from "./components/auth/RequireAuth";
import Payments from "./pages/Payments"; // Add import for Payments page
import { TenantProvider } from './contexts/TenantContext';

function App() {
  return (
    <ThemeProvider>
      <TenantProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/onboarding" element={
            <RequireAuth skipOnboardingCheck={true}>
              <OnboardingPage />
            </RequireAuth>
          } />
          <Route path="/*" element={
            <RequireAuth>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/appointments" element={<Appointments />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/professionals" element={<Professionals />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/finance" element={<Finance />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/settings/*" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </RequireAuth>
          } />
        </Routes>
        <Toaster richColors position="top-right" />
      </TenantProvider>
    </ThemeProvider>
  );
}

export default App;
