
import React from 'react';
import { Outlet } from 'react-router-dom';
import { OptimizedTenantProvider } from '@/contexts/OptimizedTenantContext';
import { SecurityProvider } from '@/contexts/SecurityProvider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Header } from '@/components/layout/Header';
import { Toaster } from 'sonner';

export const OptimizedLayout = () => {
  return (
    <OptimizedTenantProvider>
      <SecurityProvider>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <main className="flex-1 flex flex-col">
              <Header />
              <div className="flex-1 p-6 bg-gray-50">
                <Outlet />
              </div>
            </main>
          </div>
          <Toaster position="top-right" />
        </SidebarProvider>
      </SecurityProvider>
    </OptimizedTenantProvider>
  );
};
