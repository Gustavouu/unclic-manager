
import { cn } from "@/lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "white";
}

export const Logo = ({ className, variant = "default", ...props }: LogoProps) => {
  return (
    <div className={cn("flex items-center", className)} {...props}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2"
      >
        <rect
          width="32"
          height="32"
          rx="8"
          fill={variant === "white" ? "#FFFFFF" : "#3B82F6"}
        />
        <path
          d="M22 10L16 16M16 16L10 22M16 16L10 10M16 16L22 22"
          stroke={variant === "white" ? "#3B82F6" : "#FFFFFF"}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={cn(
        "font-bold text-xl tracking-tight", 
        variant === "white" ? "text-white" : "text-gray-900"
      )}>
        Unclic<span className="text-blue-600">Manager</span>
      </span>
    </div>
  );
};
