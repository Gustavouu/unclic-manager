
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  useNavigate,
  Routes,
} from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Clients from "./pages/Clients";
import Services from "./pages/Services";
import Professionals from "./pages/Professionals";
import Inventory from "./pages/Inventory";
import Finance from "./pages/Finance";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Payments from "./pages/Payments";
import OnboardingPage from "./pages/Onboarding";
import BusinessWebsite from "./pages/BusinessWebsite";
import RequireAuth from "./components/auth/RequireAuth";
import { AppLayout } from "./components/layout/AppLayout";
import { OnboardingProvider } from "./contexts/onboarding/OnboardingContext";

function App() {
  return (
    <OnboardingProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        <Route path="/dashboard" element={
          <RequireAuth>
            <AppLayout breadcrumb={[{ label: "Dashboard" }]}>
              <Dashboard />
            </AppLayout>
          </RequireAuth>
        } />
        <Route path="/appointments" element={
          <RequireAuth>
            <AppLayout breadcrumb={[{ label: "Agenda" }]}>
              <Appointments />
            </AppLayout>
          </RequireAuth>
        } />
        <Route path="/clients" element={
          <RequireAuth>
            <AppLayout breadcrumb={[{ label: "Clientes" }]}>
              <Clients />
            </AppLayout>
          </RequireAuth>
        } />
        <Route path="/services" element={
          <RequireAuth>
            <AppLayout breadcrumb={[{ label: "Serviços" }]}>
              <Services />
            </AppLayout>
          </RequireAuth>
        } />
        <Route path="/professionals" element={
          <RequireAuth>
            <AppLayout breadcrumb={[{ label: "Profissionais" }]}>
              <Professionals />
            </AppLayout>
          </RequireAuth>
        } />
        <Route path="/inventory" element={
          <RequireAuth>
            <AppLayout breadcrumb={[{ label: "Estoque" }]}>
              <Inventory />
            </AppLayout>
          </RequireAuth>
        } />
        <Route path="/finance" element={
          <RequireAuth>
            <AppLayout breadcrumb={[{ label: "Financeiro" }]}>
              <Finance />
            </AppLayout>
          </RequireAuth>
        } />
        <Route path="/payments" element={
          <RequireAuth>
            <AppLayout breadcrumb={[{ label: "Pagamentos" }]}>
              <Payments />
            </AppLayout>
          </RequireAuth>
        } />
        <Route path="/reports" element={
          <RequireAuth>
            <AppLayout breadcrumb={[{ label: "Relatórios" }]}>
              <Reports />
            </AppLayout>
          </RequireAuth>
        } />
        <Route path="/settings" element={
          <RequireAuth>
            <AppLayout breadcrumb={[{ label: "Configurações" }]}>
              <Settings />
            </AppLayout>
          </RequireAuth>
        } />
        <Route path="/onboarding" element={
          <RequireAuth>
            <OnboardingPage />
          </RequireAuth>
        } />
        
        {/* Apenas uma rota para o site do negócio com o formato .unclic.com.br */}
        <Route path="/:businessName.unclic.com.br" element={<BusinessWebsite />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </OnboardingProvider>
  );
}

export default App;
