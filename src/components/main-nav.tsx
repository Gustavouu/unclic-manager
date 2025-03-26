
import * as React from "react";
import { Link } from "react-router-dom";

export function MainNav({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className={className}>
      <Link to="/" className="flex items-center space-x-2">
        <span className="text-xl font-bold">Unclic</span>
      </Link>
    </div>
  );
}
