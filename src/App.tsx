import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryProvider } from './contexts/QueryContext';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Services from './pages/Services';
import Professionals from './pages/Professionals';
import Bookings from './pages/Bookings';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MultiTenantProvider } from '@/contexts/MultiTenantContext';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryProvider>
          <MultiTenantProvider>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/services" element={<Services />} />
                <Route path="/professionals" element={<Professionals />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
              <Toaster />
            </div>
          </MultiTenantProvider>
        </QueryProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
