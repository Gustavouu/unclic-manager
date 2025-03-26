
import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function MainNav({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className={cn("flex items-center", className)}>
      <Link to="/" className="flex items-center space-x-2">
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Unclic
        </span>
      </Link>
    </div>
  );
}
