
import React from 'react';
import { MobileSidebar } from './sidebar/MobileSidebar';

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 dark:bg-background dark:border-gray-800">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button - only visible on mobile */}
        <div className="md:hidden">
          <MobileSidebar />
        </div>
        
        {/* Header content */}
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Page title or breadcrumbs could go here */}
          </div>
          
          <div className="flex items-center gap-4">
            {/* User menu, notifications, etc. could go here */}
          </div>
        </div>
      </div>
    </header>
  );
};
