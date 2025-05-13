
import * as React from "react";
import { MainNav } from "@/components/main-nav";
import { MenuSections } from "@/components/layout/sidebar/MenuSections";
import { UserDropdown } from "@/components/layout/sidebar/UserDropdown";

interface SidebarProps extends React.ComponentProps<"div"> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className="h-full w-60 border-r bg-white dark:bg-neutral-950 fixed inset-y-0 left-0 z-20 shadow-sm flex flex-col">
      <div className="flex flex-col h-full">
        <div className="px-4 py-4 border-b">
          <MainNav className="mx-auto" />
        </div>
        
        <div className="flex-1 overflow-y-auto py-1">
          <MenuSections />
        </div>

        <UserDropdown />
      </div>
    </div>
  );
}

export { MobileSidebar } from "@/components/layout/sidebar/MobileSidebar";
