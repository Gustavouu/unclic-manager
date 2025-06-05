
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, Search, Bell, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar/context";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface HeaderProps {
  breadcrumb?: BreadcrumbItem[];
}

export const Header: React.FC<HeaderProps> = ({ breadcrumb }) => {
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {/* Mobile menu trigger */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-9 w-9"
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}

          {/* Breadcrumb */}
          {breadcrumb && breadcrumb.length > 0 && (
            <nav className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
              {breadcrumb.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span>/</span>}
                  <span className={cn(
                    index === breadcrumb.length - 1 ? 'text-foreground font-medium' : 'hover:text-foreground'
                  )}>
                    {item.label}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          )}
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes, agendamentos..."
              className="pl-10 bg-muted/50 border-0 focus-visible:bg-background"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Mobile search */}
          <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Help */}
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <HelpCircle className="h-4 w-4" />
            <span className="sr-only">Help</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          {/* User menu */}
          <div className="flex items-center">
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                U
              </div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
