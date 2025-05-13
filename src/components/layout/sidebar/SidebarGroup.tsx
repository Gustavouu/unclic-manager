
import { cn } from "@/lib/utils";

interface SidebarGroupProps {
  title?: string;
  children: React.ReactNode;
}

export function SidebarGroup({ title, children }: SidebarGroupProps) {
  return (
    <div className="py-2">
      {title && (
        <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
