
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
    <div className="hidden border-r bg-gray-100 dark:bg-neutral-950 md:flex md:w-60 md:flex-col md:fixed md:inset-y-0">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
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
