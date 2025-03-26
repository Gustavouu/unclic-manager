
import * as React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/sidebar/sidebar-trigger";
import { SidebarMain } from "./SidebarMain";
import { MenuSections } from "./MenuSections";
import { UserDropdown } from "./UserDropdown";

export function MobileSidebar({ className }: React.ComponentProps<"div">) {
  const isMobile = useMobile();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <SidebarTrigger />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex w-full flex-col border-r bg-white dark:bg-neutral-950 sm:max-w-xs"
      >
        <SheetHeader className="px-6">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-1 py-4">
          <SidebarMain>
            <MenuSections />
          </SidebarMain>

          <UserDropdown />
        </div>
      </SheetContent>
    </Sheet>
  );
}
