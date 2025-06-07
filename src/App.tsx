
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryProvider } from './contexts/QueryContext';
import { ErrorHandlingProvider } from './contexts/ErrorHandlingContext';
import { AuthProvider } from './contexts/AuthContext';
import { RequireAuth } from './components/auth/RequireAuth';
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
          <ErrorHandlingProvider>
            <AuthProvider>
              <div className="min-h-screen bg-background">
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected routes */}
                  <Route path="/" element={
                    <RequireAuth>
                      <MultiTenantProvider>
                        <Dashboard />
                      </MultiTenantProvider>
                    </RequireAuth>
                  } />
                  
                  <Route path="/clients" element={
                    <RequireAuth>
                      <MultiTenantProvider>
                        <Clients />
                      </MultiTenantProvider>
                    </RequireAuth>
                  } />
                  
                  <Route path="/services" element={
                    <RequireAuth>
                      <MultiTenantProvider>
                        <Services />
                      </MultiTenantProvider>
                    </RequireAuth>
                  } />
                  
                  <Route path="/professionals" element={
                    <RequireAuth>
                      <MultiTenantProvider>
                        <Professionals />
                      </MultiTenantProvider>
                    </RequireAuth>
                  } />
                  
                  <Route path="/bookings" element={
                    <RequireAuth>
                      <MultiTenantProvider>
                        <Bookings />
                      </MultiTenantProvider>
                    </RequireAuth>
                  } />
                  
                  <Route path="/settings" element={
                    <RequireAuth>
                      <MultiTenantProvider>
                        <Settings />
                      </MultiTenantProvider>
                    </RequireAuth>
                  } />
                  
                  {/* Redirect any unknown routes to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Toaster />
              </div>
            </AuthProvider>
          </ErrorHandlingProvider>
        </QueryProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
