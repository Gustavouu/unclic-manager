
import * as React from "react";
import { useMobile } from "@/hooks/use-mobile";
import { MainNav } from "@/components/main-nav";
import { SidebarMain } from "./sidebar/SidebarMain";
import { MenuSections } from "./sidebar/MenuSections";
import { UserDropdown } from "./sidebar/UserDropdown";
import { MobileSidebar } from "./sidebar/MobileSidebar";

interface SidebarProps extends React.ComponentProps<"div"> {}

export function Sidebar({ className }: SidebarProps) {
  const isMobile = useMobile();

  if (isMobile) {
    return <MobileSidebar />;
  }

  return (
    <div className="hidden border-r bg-white dark:bg-neutral-950 md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 z-10">
      <div className="flex flex-col h-full">
        <div className="px-4 py-4 border-b">
          <MainNav className="mx-auto" />
        </div>
        
        <SidebarMain>
          <MenuSections />
        </SidebarMain>

        <UserDropdown />
      </div>
    </div>
  );
}

export { MobileSidebar } from "./sidebar/MobileSidebar";
