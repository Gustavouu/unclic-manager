
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type AppLayoutProps = {
  children: ReactNode;
  title: string;
};

export const AppLayout = ({ children, title }: AppLayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      
      <main className={cn(
        "flex-1 flex flex-col transition-all duration-300 ease-in-out", 
        isMobile ? "ml-0" : "ml-20 md:ml-64"
      )}>
        <Header title={title} />
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
