
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
    <div className="flex h-screen w-full bg-gray-50 dark:bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col ml-16 md:ml-60">
        <Header breadcrumb={breadcrumb} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="container mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
