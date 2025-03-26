
import * as React from "react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  return (
    <nav className="flex flex-col space-y-1" {...props}>
      {props.children}
    </nav>
  );
}
