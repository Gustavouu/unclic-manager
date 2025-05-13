
import * as React from "react";
import { useMobile } from "@/hooks/use-mobile";
import { MainNav } from "@/components/main-nav";
import { SidebarMain } from "@/components/layout/sidebar/SidebarMain";
import { MenuSections } from "@/components/layout/sidebar/MenuSections";
import { UserDropdown } from "@/components/layout/sidebar/UserDropdown";
import { MobileSidebar } from "@/components/layout/sidebar/MobileSidebar";
import { cn } from "@/lib/utils";

interface SidebarProps extends React.ComponentProps<"div"> {
  isOpen?: boolean;
}

export function Sidebar({ className, isOpen = true }: SidebarProps) {
  const isMobile = useMobile();

  if (isMobile) {
    return <MobileSidebar />;
  }

  return (
    <div className={cn(
      "hidden border-r bg-white dark:bg-neutral-950 md:flex md:flex-col md:fixed md:inset-y-0 z-20 shadow-sm transition-all duration-300",
      isOpen ? "md:w-60" : "md:w-16",
      className
    )}>
      <div className="flex flex-col h-full">
        <div className={cn("px-4 py-4 border-b", {
          "flex justify-center": !isOpen
        })}>
          <MainNav className="mx-auto" collapsed={!isOpen} />
        </div>
        
        <SidebarMain>
          <MenuSections collapsed={!isOpen} />
        </SidebarMain>

        {isOpen && <UserDropdown />}
      </div>
    </div>
  );
}

export { MobileSidebar } from "@/components/layout/sidebar/MobileSidebar";
