
import React, { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/auth/RequireAuth";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import Dashboard from "@/pages/Dashboard";
import Clients from "@/pages/Clients";
import Appointments from "@/pages/Appointments";
import Services from "@/pages/Services";
import Professionals from "@/pages/Professionals";
import Finance from "@/pages/Finance";
import Reports from "@/pages/Reports";
import Inventory from "@/pages/Inventory";
import Settings from "@/pages/Settings";
import Payments from "@/pages/Payments";
import NotFound from "@/pages/NotFound";
import Onboarding from "@/pages/Onboarding";
import BusinessWebsite from "@/pages/BusinessWebsite";
import PaymentApiTest from "@/pages/PaymentApiTest"; // Adicionado o import para a página de teste

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("accessToken") ? true : false
  );

  // Function to update authentication status
  const updateAuthStatus = (status: boolean) => {
    setIsAuthenticated(status);
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="unclic-theme">
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Index />} />
        <Route path="/website" element={<BusinessWebsite />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Protected Routes - Requires Authentication */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/clients"
          element={
            <RequireAuth>
              <Clients />
            </RequireAuth>
          }
        />
        <Route
          path="/appointments"
          element={
            <RequireAuth>
              <Appointments />
            </RequireAuth>
          }
        />
        <Route
          path="/services"
          element={
            <RequireAuth>
              <Services />
            </RequireAuth>
          }
        />
        <Route
          path="/professionals"
          element={
            <RequireAuth>
              <Professionals />
            </RequireAuth>
          }
        />
        <Route
          path="/finance"
          element={
            <RequireAuth>
              <Finance />
            </RequireAuth>
          }
        />
        <Route
          path="/reports"
          element={
            <RequireAuth>
              <Reports />
            </RequireAuth>
          }
        />
        <Route
          path="/inventory"
          element={
            <RequireAuth>
              <Inventory />
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <Settings />
            </RequireAuth>
          }
        />
        <Route
          path="/payments"
          element={
            <RequireAuth>
              <Payments />
            </RequireAuth>
          }
        />

        {/* Rota protegida para a página de teste de API (não aparece na navegação) */}
        <Route
          path="/payment-api-test"
          element={
            <RequireAuth>
              <PaymentApiTest />
            </RequireAuth>
          }
        />

        {/* Not Found Route - Must be the last one */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
