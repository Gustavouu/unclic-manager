
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";

type AppLayoutProps = {
  children: ReactNode;
  title: string;
};

export const AppLayout = ({ children, title }: AppLayoutProps) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Fixed sidebar */}
      <div className="fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </div>
      
      {/* Main content area with proper margin to account for fixed sidebar */}
      <main className="flex-1 flex flex-col ml-20 md:ml-64 w-full h-screen">
        <Header title={title} />
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
