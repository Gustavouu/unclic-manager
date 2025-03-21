
import { AppLayout } from "@/components/layout/AppLayout";
import { ReactNode } from "react";

type ClientsLayoutProps = {
  children: ReactNode;
};

export const ClientsLayout = ({ children }: ClientsLayoutProps) => {
  return (
    <AppLayout title="Gerenciamento de Clientes">
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <h1 className="text-2xl font-bold mb-6">Gerenciamento de Clientes</h1>
        {children}
      </div>
    </AppLayout>
  );
};
