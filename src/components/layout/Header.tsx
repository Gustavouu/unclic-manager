
import React from 'react';
import { MobileSidebar } from './sidebar/MobileSidebar';
import { Breadcrumb } from './Breadcrumb';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface HeaderProps {
  breadcrumb?: BreadcrumbItem[];
}

export const Header = ({ breadcrumb }: HeaderProps) => {
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
            {breadcrumb && breadcrumb.length > 0 && (
              <Breadcrumb items={breadcrumb.map(item => ({ ...item, active: false }))} />
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {/* User menu, notifications, etc. could go here */}
          </div>
        </div>
      </div>
    </header>
  );
};
