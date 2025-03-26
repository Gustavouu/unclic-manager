
import * as React from "react";
import { SidebarNav } from "./SidebarNav";

interface SidebarGroupProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
}

export function SidebarGroup({ title, ...props }: SidebarGroupProps) {
  return (
    <div className="pt-6 first:pt-0">
      <div className="mb-2 px-4 text-sm font-semibold opacity-60">{title}</div>
      <SidebarNav>{props.children}</SidebarNav>
    </div>
  );
}
