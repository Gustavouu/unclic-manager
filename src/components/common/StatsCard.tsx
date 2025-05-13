
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  iconColor?: string;
  borderColor?: string;
  isLoading?: boolean;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  iconColor = "bg-blue-50 text-blue-500",
  borderColor = "border-l-blue-600",
  isLoading = false
}: StatsCardProps) {
  return (
    <Card className={`overflow-hidden border-l-4 ${borderColor}`}>
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            
            {isLoading ? (
              <Skeleton className="h-7 w-24 mt-1" />
            ) : (
              <p className="text-2xl font-bold mt-1">{value}</p>
            )}
            
            {description && (
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
          
          {icon && (
            <div className={`p-2 rounded-full ${iconColor}`}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
