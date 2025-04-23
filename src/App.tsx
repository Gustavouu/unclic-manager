import React from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { RequireAuth } from "./components/auth/RequireAuth";
import { AppLayout } from "./components/layout/AppLayout";
import { OnboardingProvider } from "./contexts/onboarding/OnboardingContext";
import { AuthProvider } from "./hooks/useAuth";

// Pages
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Appointments from "./pages/Appointments";
import Services from "./pages/Services";
import Professionals from "./pages/Professionals";
import Finance from "./pages/Finance";
import Reports from "./pages/Reports";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";
import Payments from "./pages/Payments";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import BusinessWebsite from "./pages/BusinessWebsite";
import PaymentApiTest from "./pages/PaymentApiTest";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="unclic-theme">
      <AuthProvider>
        <Toaster />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Index />} />
          <Route 
            path="/website" 
            element={
              <OnboardingProvider>
                <BusinessWebsite />
              </OnboardingProvider>
            } 
          />
          <Route path="/onboarding" element={
            <OnboardingProvider>
              <Onboarding />
            </OnboardingProvider>
          } />

          {/* Protected Routes - Requires Authentication */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <AppLayout breadcrumb={[{ label: "Dashboard" }]}>
                  <Dashboard />
                </AppLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/clients"
            element={
              <RequireAuth>
                <AppLayout breadcrumb={[{ label: "Dashboard", path: "/dashboard" }, { label: "Clientes" }]}>
                  <Clients />
                </AppLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/appointments"
            element={
              <RequireAuth>
                <AppLayout breadcrumb={[{ label: "Dashboard", path: "/dashboard" }, { label: "Agenda" }]}>
                  <Appointments />
                </AppLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/services"
            element={
              <RequireAuth>
                <AppLayout breadcrumb={[{ label: "Dashboard", path: "/dashboard" }, { label: "Serviços" }]}>
                  <Services />
                </AppLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/professionals"
            element={
              <RequireAuth>
                <AppLayout breadcrumb={[{ label: "Dashboard", path: "/dashboard" }, { label: "Profissionais" }]}>
                  <Professionals />
                </AppLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/finance"
            element={
              <RequireAuth>
                <AppLayout breadcrumb={[{ label: "Dashboard", path: "/dashboard" }, { label: "Financeiro" }]}>
                  <Finance />
                </AppLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/reports"
            element={
              <RequireAuth>
                <AppLayout breadcrumb={[{ label: "Dashboard", path: "/dashboard" }, { label: "Relatórios" }]}>
                  <Reports />
                </AppLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/inventory"
            element={
              <RequireAuth>
                <AppLayout breadcrumb={[{ label: "Dashboard", path: "/dashboard" }, { label: "Estoque" }]}>
                  <Inventory />
                </AppLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <AppLayout breadcrumb={[{ label: "Dashboard", path: "/dashboard" }, { label: "Configurações" }]}>
                  <Settings />
                </AppLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/payments"
            element={
              <RequireAuth>
                <AppLayout breadcrumb={[{ label: "Dashboard", path: "/dashboard" }, { label: "Pagamentos" }]}>
                  <Payments />
                </AppLayout>
              </RequireAuth>
            }
          />

          {/* Protected route for payment API test page (not shown in navigation) */}
          <Route
            path="/payment-api-test"
            element={
              <RequireAuth>
                <AppLayout breadcrumb={[{ label: "Dashboard", path: "/dashboard" }, { label: "Teste de API" }]}>
                  <PaymentApiTest />
                </AppLayout>
              </RequireAuth>
            }
          />

          {/* Not Found Route - Must be the last one */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
