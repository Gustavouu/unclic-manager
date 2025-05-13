
import { Bell, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

interface HeaderProps {
  onMenuToggle: () => void;
  breadcrumb?: { label: string; path?: string }[];
}

export function Header({ onMenuToggle, breadcrumb }: HeaderProps) {
  const location = useLocation();
  
  // Generate breadcrumbs based on the current path or use provided breadcrumb
  const generateBreadcrumb = () => {
    // If breadcrumb prop is provided, use it
    if (breadcrumb && breadcrumb.length > 0) {
      return (
        <div className="flex items-center gap-1">
          {breadcrumb.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <span className="text-muted-foreground mx-1">/</span>}
              <span className={index === breadcrumb.length - 1 ? "" : "text-muted-foreground"}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      );
    }
    
    // Default breadcrumb generation based on location
    const paths = location.pathname.split('/').filter(Boolean);
    
    if (paths.length === 0) {
      return (
        <div className="flex items-center gap-1">
          <span>Início</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground">Início</span>
        <span className="text-muted-foreground mx-1">/</span>
        <span>{paths[0].charAt(0).toUpperCase() + paths[0].slice(1)}</span>
      </div>
    );
  };
  
  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b bg-white dark:bg-background dark:border-gray-800 flex items-center px-4 md:px-6">
      <div className="flex items-center gap-4 lg:gap-6 w-full">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        
        <div className="hidden md:flex text-sm">
          {generateBreadcrumb()}
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600"></span>
            <span className="sr-only">Notificações</span>
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
              <span className="text-sm font-semibold">GU</span>
            </div>
            <span className="hidden md:inline-flex text-sm font-medium">
              Gustavo Henrique
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}
