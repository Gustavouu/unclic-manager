
import React from "react";
import { cn } from "@/lib/utils";

interface ProgressCircleProps {
  size?: "small" | "default" | "large";
  className?: string;
}

export function ProgressCircle({ size = "default", className }: ProgressCircleProps) {
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    default: "h-8 w-8 border-3",
    large: "h-12 w-12 border-4",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          "animate-spin rounded-full border-t-transparent border-primary",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
}
