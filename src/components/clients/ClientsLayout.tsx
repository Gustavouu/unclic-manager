
import { ReactNode } from "react";

type ClientsLayoutProps = {
  children: ReactNode;
};

export const ClientsLayout = ({ children }: ClientsLayoutProps) => {
  return (
    <div className="space-y-4">
      {children}
    </div>
  );
};
