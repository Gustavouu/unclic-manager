
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserRound,
  ShoppingBag,
  Banknote,
  Scissors,
  MessageSquare,
  BarChart2,
  Settings,
  HelpCircle,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive: boolean;
};

const SidebarItem = ({ icon, label, to, isActive }: SidebarItemProps) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={to} className={cn("sidebar-item group", isActive && "active")}>
            <div className="sidebar-icon">{icon}</div>
            <span className="sidebar-label">{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10} className="md:hidden">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const Sidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  
  const pathName = location.pathname;
  
  const routes = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/dashboard" },
    { icon: <Calendar size={20} />, label: "Agendamentos", path: "/appointments" },
    { icon: <Users size={20} />, label: "Clientes", path: "/clients" },
    { icon: <UserRound size={20} />, label: "Colaboradores", path: "/professionals" },
    { icon: <ShoppingBag size={20} />, label: "Estoque", path: "/inventory" },
    { icon: <Banknote size={20} />, label: "Financeiro", path: "/finance" },
    { icon: <Scissors size={20} />, label: "Serviços", path: "/services" },
    { icon: <MessageSquare size={20} />, label: "Mensagens", path: "/messages" },
    { icon: <BarChart2 size={20} />, label: "Relatórios", path: "/reports" },
    { icon: <Settings size={20} />, label: "Configurações", path: "/settings" },
    { icon: <HelpCircle size={20} />, label: "Ajuda", path: "/help" },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isMobile && (
        <button 
          className="fixed z-50 top-4 left-4 p-2 bg-sidebar-background rounded-lg text-sidebar-foreground shadow-md"
          onClick={toggleSidebar}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}
      
      <aside 
        className={cn(
          "bg-sidebar-background h-screen flex flex-col top-0 left-0 z-40 transition-all duration-300 ease-in-out shadow-md",
          isOpen ? "w-64 translate-x-0" : isMobile ? "w-64 -translate-x-full" : "w-20"
        )}
      >
        <div className={cn(
          "flex items-center justify-center py-6 border-b border-sidebar-border transition-all duration-300 ease-out",
          !isOpen && !isMobile && "py-5"
        )}>
          <h1 className={cn(
            "font-display font-bold text-2xl text-sidebar-foreground whitespace-nowrap transition-all duration-300 ease-out",
            !isOpen && !isMobile && "scale-0 opacity-0 w-0"
          )}>
            Unclic
          </h1>
          {!isOpen && !isMobile && (
            <h1 className="font-display font-bold text-2xl text-sidebar-foreground">U</h1>
          )}
        </div>
        
        <nav className="mt-6 space-y-1 px-3 flex-1 overflow-y-auto">
          {routes.map((route) => (
            <SidebarItem
              key={route.path}
              icon={route.icon}
              label={isOpen || isMobile ? route.label : ""}
              to={route.path}
              isActive={pathName === route.path}
            />
          ))}
        </nav>
        
        {isOpen && (
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground font-medium">
                U
              </div>
              <div>
                <p className="text-sidebar-foreground font-medium">Salão Exemplo</p>
                <p className="text-sidebar-foreground/60 text-sm">Admin</p>
              </div>
            </div>
          </div>
        )}

        {!isOpen && !isMobile && (
          <div className="p-4 border-t border-sidebar-border flex justify-center">
            <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground font-medium">
              U
            </div>
          </div>
        )}
        
        <div className={cn(
          "p-3 border-t border-sidebar-border",
          !isOpen && !isMobile && "flex justify-center"
        )}>
          <button className={cn(
            "w-full py-2 px-3 rounded-md flex items-center gap-2 text-sidebar-foreground/80 hover:bg-sidebar-accent/50 transition-colors",
            !isOpen && !isMobile && "justify-center p-2"
          )}>
            <LogOut size={20} />
            {(isOpen || isMobile) && <span>Sair</span>}
          </button>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 backdrop-blur-sm transition-all duration-300 ease-in-out"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};
