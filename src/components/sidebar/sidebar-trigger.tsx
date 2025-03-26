
import * as React from "react";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";

export function SidebarTrigger() {
  return (
    <Button variant="ghost" size="icon" className="h-9 w-9">
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}
