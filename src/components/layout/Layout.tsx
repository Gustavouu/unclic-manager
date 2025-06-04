
import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar/Sidebar";
import { Header } from "./Header";
import { MobileSidebar } from "./sidebar/MobileSidebar";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

type LayoutProps = {
  children: ReactNode;
  breadcrumb?: BreadcrumbItem[];
};

export const Layout = ({ children, breadcrumb }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      {/* Mobile Sidebar */}
      <MobileSidebar />
      
      {/* Desktop Sidebar - Fixed */}
      <div className="hidden md:fixed md:inset-y-0 md:z-50 md:flex md:w-60 md:flex-col">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col md:pl-60">
        {/* Header */}
        <Header breadcrumb={breadcrumb} />
        
        {/* Page Content */}
        <main className="flex-1 py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
