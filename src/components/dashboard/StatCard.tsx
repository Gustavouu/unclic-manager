
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
};

export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
  iconClassName,
}: StatCardProps) => {
  return (
    <div className={cn("stat-card animated-border", className)}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
        <div className={cn("p-2 rounded-lg", iconClassName || "bg-primary/10 text-primary")}>
          {icon}
        </div>
      </div>
      
      <div className="mt-auto">
        <div className="flex items-baseline gap-1">
          <h2 className="text-2xl font-display font-semibold">{value}</h2>
          {trend && (
            <span
              className={cn(
                "text-xs font-medium ml-2 px-1.5 py-0.5 rounded",
                trend.isPositive
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              )}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
