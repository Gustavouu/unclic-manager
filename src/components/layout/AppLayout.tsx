
import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";

type AppLayoutProps = {
  children: ReactNode;
  breadcrumb?: { label: string; path?: string }[];
};

export const AppLayout = ({ children, breadcrumb }: AppLayoutProps) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area with proper margin to account for sidebar */}
      <main className="flex-1 flex flex-col ml-16 md:ml-60 h-screen overflow-hidden">
        <Header breadcrumb={breadcrumb} />
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="container mx-auto max-w-7xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
