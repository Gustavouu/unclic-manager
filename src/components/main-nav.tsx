
import { cn } from "@/lib/utils";

interface MainNavProps {
  className?: string;
  collapsed?: boolean;
}

export function MainNav({ className, collapsed = false }: MainNavProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <span className={cn(
        "text-lg font-bold text-primary transition-all",
        collapsed ? "hidden" : "block"
      )}>
        Unclic
      </span>
      {collapsed && (
        <span className="text-lg font-bold text-primary">U</span>
      )}
    </div>
  );
}
