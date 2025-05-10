
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { AppLayout } from './components/layout/AppLayout';
import { ToastProvider } from './components/ui/toast-provider';
import './App.css';
import RequireAuth from './components/auth/RequireAuth';

// Import pages
import Services from './pages/Services';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Settings from './pages/Settings';
import Inventory from './pages/Inventory';
import Professionals from './pages/Professionals';
import Clients from './pages/Clients';
import Appointments from './pages/Appointments';
import Index from './pages/Index';
import SignUp from './pages/auth/SignUp';
import ResetPassword from './pages/auth/ResetPassword';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="unclic-theme">
      <ToastProvider />
      <Routes>
        {/* Root path redirects based on auth state */}
        <Route path="/" element={<Index />} />
        
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <RequireAuth>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </RequireAuth>
        } />
        <Route path="/services" element={
          <RequireAuth>
            <AppLayout breadcrumb={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Serviços' }]}>
              <Services />
            </AppLayout>
          </RequireAuth>
        } />
        <Route path="/inventory" element={
          <RequireAuth>
            <AppLayout breadcrumb={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Estoque' }]}>
              <Inventory />
            </AppLayout>
          </RequireAuth>
        } />
        <Route path="/professionals" element={
          <RequireAuth>
            <AppLayout breadcrumb={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Colaboradores' }]}>
              <Professionals />
            </AppLayout>
          </RequireAuth>
        } />
        <Route path="/clients" element={
          <RequireAuth>
            <AppLayout breadcrumb={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Clientes' }]}>
              <Clients />
            </AppLayout>
          </RequireAuth>
        } />
        <Route path="/appointments" element={
          <RequireAuth>
            <AppLayout breadcrumb={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Agendamentos' }]}>
              <Appointments />
            </AppLayout>
          </RequireAuth>
        } />
        <Route path="/settings/*" element={
          <RequireAuth>
            <AppLayout breadcrumb={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Configurações' }]}>
              <Settings />
            </AppLayout>
          </RequireAuth>
        } />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
