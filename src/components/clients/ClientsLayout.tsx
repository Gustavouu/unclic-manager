
import { ReactNode } from "react";

type ClientsLayoutProps = {
  children: ReactNode;
};

export const ClientsLayout = ({ children }: ClientsLayoutProps) => {
  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {children}
    </div>
  );
};
