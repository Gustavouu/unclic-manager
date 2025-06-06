
import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar/Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "./sidebar/MobileSidebar";
import { SidebarProvider } from "@/components/ui/sidebar/context";

type AppLayoutProps = {
  children: ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-background">
        <Sidebar />
        <MobileSidebar />
        
        <div className="flex-1 flex flex-col ml-16 md:ml-60">
          <Header />
          <main className="flex-1 overflow-auto p-4 sm:p-6">
            <div className="container mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
