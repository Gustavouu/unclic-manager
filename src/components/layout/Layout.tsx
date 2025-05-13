
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar/Sidebar';
import { Header } from './Header';
import { MobileSidebar } from './sidebar/MobileSidebar';

const Layout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block md:w-60 md:flex-shrink-0">
        <Sidebar />
      </div>
      
      {/* Mobile sidebar */}
      <MobileSidebar />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="container mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
