
import { ReactNode, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar/Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "./sidebar/MobileSidebar";

type AppLayoutProps = {
  children: ReactNode;
  breadcrumb?: { label: string; path?: string }[];
};

export const AppLayout = ({ children, breadcrumb }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-background">
      <Sidebar isOpen={sidebarOpen} />
      <MobileSidebar />
      
      <div className={cn("flex-1 flex flex-col transition-all duration-300", {
        "ml-0 md:ml-16": !sidebarOpen,
        "ml-16 md:ml-60": sidebarOpen
      })}>
        <Header onMenuToggle={handleMenuToggle} breadcrumb={breadcrumb} />
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="container mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
