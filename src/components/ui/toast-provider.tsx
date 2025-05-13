
import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

interface ToastProviderProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";
  className?: string;
}

export function ToastProvider({
  position = "bottom-right",
  className,
}: ToastProviderProps) {
  const { theme = "system" } = useTheme();

  return (
    <Toaster
      position={position}
      theme={theme as "light" | "dark" | "system"}
      className={cn("toaster group", className)}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error:
            "group-[.toaster]:bg-destructive group-[.toaster]:text-destructive-foreground group-[.toaster]:border-destructive/30",
          success:
            "group-[.toaster]:bg-green-50 group-[.toaster]:text-green-800 group-[.toaster]:border-green-200 dark:group-[.toaster]:bg-green-950 dark:group-[.toaster]:text-green-200 dark:group-[.toaster]:border-green-900/30",
          info:
            "group-[.toaster]:bg-blue-50 group-[.toaster]:text-blue-800 group-[.toaster]:border-blue-200 dark:group-[.toaster]:bg-blue-950 dark:group-[.toaster]:text-blue-200 dark:group-[.toaster]:border-blue-900/30",
          warning:
            "group-[.toaster]:bg-yellow-50 group-[.toaster]:text-yellow-800 group-[.toaster]:border-yellow-200 dark:group-[.toaster]:bg-yellow-950 dark:group-[.toaster]:text-yellow-200 dark:group-[.toaster]:border-yellow-900/30",
        },
      }}
    />
  );
}
