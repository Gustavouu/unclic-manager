
import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useSidebar } from '@/components/ui/sidebar/context';
import { MainNav } from '@/components/main-nav';
import { MenuSections } from './MenuSections';
import { UserDropdown } from './UserDropdown';

export const MobileSidebar: React.FC = () => {
  const { openMobile, setOpenMobile, isMobile } = useSidebar();

  if (!isMobile) return null;

  return (
    <Sheet open={openMobile} onOpenChange={setOpenMobile}>
      <SheetContent side="left" className="w-64 p-0 bg-background">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-4 py-4 border-b">
            <MainNav className="mx-auto" />
          </div>
          
          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <MenuSections />
          </div>

          {/* User Dropdown */}
          <UserDropdown />
        </div>
      </SheetContent>
    </Sheet>
  );
};
