
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { AppLayout } from './components/layout/AppLayout';
import { ToastProvider } from './components/ui/toast-provider';
import './App.css';

// Import pages
import Services from './pages/Services';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Settings from './pages/Settings';
import Inventory from './pages/Inventory';
import Professionals from './pages/Professionals';
import Clients from './pages/Clients';
import Appointments from './pages/Appointments';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="unclic-theme">
      <ToastProvider />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <AppLayout>
            <Dashboard />
          </AppLayout>
        } />
        <Route path="/services" element={
          <AppLayout breadcrumb={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Serviços' }]}>
            <Services />
          </AppLayout>
        } />
        <Route path="/inventory" element={
          <AppLayout breadcrumb={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Estoque' }]}>
            <Inventory />
          </AppLayout>
        } />
          <Route path="/professionals" element={
          <AppLayout breadcrumb={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Colaboradores' }]}>
            <Professionals />
          </AppLayout>
        } />
        <Route path="/clients" element={
          <AppLayout breadcrumb={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Clientes' }]}>
            <Clients />
          </AppLayout>
        } />
        <Route path="/appointments" element={
          <AppLayout breadcrumb={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Agendamentos' }]}>
            <Appointments />
          </AppLayout>
        } />
        <Route path="/settings/*" element={
          <AppLayout breadcrumb={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Configurações' }]}>
            <Settings />
          </AppLayout>
        } />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
