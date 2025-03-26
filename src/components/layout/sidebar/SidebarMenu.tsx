
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarMenuAdvancedProps extends React.HTMLAttributes<HTMLElement> {
  icon: any;
  title: string;
  isLink?: boolean;
  to?: string;
  active?: boolean;
}

export function SidebarMenuItem({
  icon: Icon,
  title,
  isLink,
  to,
  active,
  ...props
}: SidebarMenuAdvancedProps) {
  return (
    <Button
      variant="ghost"
      className={cn("justify-start px-4", active ? "bg-accent" : "")}
      asChild={isLink}
    >
      <a href={to}>
        <Icon className="mr-2 h-4 w-4" />
        <span>{title}</span>
      </a>
    </Button>
  );
}
