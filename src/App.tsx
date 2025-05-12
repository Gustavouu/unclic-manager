
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/hooks/useAuth";
import { TenantProvider } from "@/contexts/TenantContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { AppInitProvider } from "@/contexts/AppInitContext";
import AdminLayout from "@/components/layouts/AdminLayout";
import RequireAuth from "@/components/auth/RequireAuth";
import Dashboard from "@/pages/Dashboard";
import Clients from "@/pages/Clients";
import Login from "@/pages/Login";
import Appointments from "@/pages/Appointments";
import Settings from "@/pages/Settings";
import Products from "@/pages/Products";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/NotFound";

import "@/styles/globals.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <LoadingProvider>
          <TenantProvider>
            <AppInitProvider>
              <Toaster position="top-right" richColors />
              
              <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route path="/" element={<RequireAuth><AdminLayout /></RequireAuth>}>
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="clients" element={<Clients />} />
                  <Route path="appointments" element={<Appointments />} />
                  <Route path="products" element={<Products />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppInitProvider>
          </TenantProvider>
        </LoadingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
