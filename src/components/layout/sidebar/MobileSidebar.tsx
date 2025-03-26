
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PanelLeft } from "lucide-react";
import { SidebarMain } from "./SidebarMain";
import { MenuSections } from "./MenuSections";
import { UserDropdown } from "./UserDropdown";

export function MobileSidebar({ className }: React.ComponentProps<"div">) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden fixed top-3 left-3 z-40">
          <PanelLeft className="h-4 w-4" />
          <span className="sr-only">Toggle sidebar</span>
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
