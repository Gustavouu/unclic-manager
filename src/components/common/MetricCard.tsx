
import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  colorScheme?: "blue" | "purple" | "green" | "amber";
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  colorScheme = "blue"
}: MetricCardProps) {
  const colorClasses = {
    blue: "border-l-blue-600 bg-blue-50/50",
    purple: "border-l-purple-600 bg-purple-50/50",
    green: "border-l-green-600 bg-green-50/50",
    amber: "border-l-amber-600 bg-amber-50/50"
  };

  const iconColors = {
    blue: "text-blue-600",
    purple: "text-purple-600",
    green: "text-green-600",
    amber: "text-amber-600"
  };

  return (
    <Card className={cn("border-l-4 relative overflow-hidden", colorClasses[colorScheme])}>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={cn("p-2 rounded-full", iconColors[colorScheme])}>
            <Icon size={20} />
          </div>
        </div>
      </div>
    </Card>
  );
}
