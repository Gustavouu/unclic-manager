
import * as React from "react";
import { cn } from "@/lib/utils";

interface SidebarMainProps extends React.HTMLAttributes<HTMLElement> {}

export function SidebarMain({ className, children, ...props }: SidebarMainProps) {
  return (
    <div className={cn("flex-1 overflow-y-auto", className)} {...props}>
      {children}
    </div>
  );
}
