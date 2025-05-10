
import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ className, children, isLoading, loadingText, icon, disabled, ...props }, ref) => {
    return (
      <Button
        className={cn("relative", className)}
        disabled={isLoading || disabled}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin" />
          </span>
        )}
        
        <span className={cn(isLoading ? "invisible" : "", "flex items-center gap-2")}>
          {icon}
          {children}
        </span>
        
        {isLoading && loadingText && (
          <span className="sr-only">{loadingText}</span>
        )}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
