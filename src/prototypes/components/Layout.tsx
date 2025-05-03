
import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = "Dashboard", 
  subtitle = "Visualize e gerencie os dados do seu negócio"
}) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Page Header */}
          <header className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </header>
          
          {/* Page Content */}
          {children}
        </main>
      </div>
    </div>
  );
};
