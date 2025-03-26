
import * as React from "react";

interface SidebarMainProps extends React.HTMLAttributes<HTMLElement> {}

export function SidebarMain({ className, ...props }: SidebarMainProps) {
  return (
    <div className="flex flex-col space-y-4 py-4" {...props}>
      {props.children}
    </div>
  );
}
