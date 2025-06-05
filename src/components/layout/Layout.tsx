
import React from 'react';
import { Header } from './Header';
import { Sidebar } from './sidebar/Sidebar';
import { MobileSidebar } from './sidebar/MobileSidebar';
import { SidebarProvider } from '@/components/ui/sidebar/context';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface LayoutProps {
  children: React.ReactNode;
  breadcrumb?: BreadcrumbItem[];
}

export const Layout: React.FC<LayoutProps> = ({ children, breadcrumb }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:ml-60">
          <Header breadcrumb={breadcrumb} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
