import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description: string;
  trending?: "up" | "down" | "neutral";
  borderColor?: string;
  iconColor?: string;
}

export const StatsCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  trending = "neutral",
  borderColor = "border-l-blue-600",
  iconColor = "text-blue-500 bg-blue-50"
}: StatsCardProps) => {
  return (
    <Card className={cn("border-l-4", borderColor)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className={cn("p-2 rounded-full", iconColor)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 