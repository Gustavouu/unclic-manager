
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";

type AppLayoutProps = {
  children: ReactNode;
  title: string;
  breadcrumb?: { label: string; path?: string }[];
};

export const AppLayout = ({ children, title, breadcrumb }: AppLayoutProps) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Fixed sidebar */}
      <Sidebar />
      
      {/* Main content area with proper margin to account for fixed sidebar */}
      <main className="flex-1 flex flex-col ml-16 md:ml-60 h-screen overflow-hidden">
        <Header title={title} breadcrumb={breadcrumb} />
        <div className="flex-1 overflow-auto p-4 sm:p-5">
          {children}
        </div>
      </main>
    </div>
  );
};
