
import * as React from "react";

interface SidebarGroupProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
}

export function SidebarGroup({ title, children }: SidebarGroupProps) {
  return (
    <div className="py-4 first:pt-0">
      <div className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}
