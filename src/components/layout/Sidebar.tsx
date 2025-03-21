
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
          <Link 
            to={to} 
            className={cn(
              "sidebar-item", 
              isActive ? "bg-blue-50 text-blue-700 before:bg-blue-600" : "hover:bg-gray-50 text-gray-700"
            )}
          >
            <div className="sidebar-icon text-[16px]">{icon}</div>
            <span className="sidebar-label text-[14px]">{label}</span>
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
    { icon: <LayoutDashboard size={18} />, label: "Dashboard", path: "/dashboard" },
    { icon: <Calendar size={18} />, label: "Agendamentos", path: "/appointments" },
    { icon: <Users size={18} />, label: "Clientes", path: "/clients" },
    { icon: <UserRound size={18} />, label: "Colaboradores", path: "/professionals" },
    { icon: <ShoppingBag size={18} />, label: "Estoque", path: "/inventory" },
    { icon: <Banknote size={18} />, label: "Financeiro", path: "/finance" },
    { icon: <Scissors size={18} />, label: "Serviços", path: "/services" },
    { icon: <MessageSquare size={18} />, label: "Mensagens", path: "/messages" },
    { icon: <BarChart2 size={18} />, label: "Relatórios", path: "/reports" },
    { icon: <Settings size={18} />, label: "Configurações", path: "/settings" },
    { icon: <HelpCircle size={18} />, label: "Ajuda", path: "/help" },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isMobile && (
        <button 
          className="fixed z-50 top-4 left-4 p-2 bg-white rounded-lg text-gray-700 shadow-md"
          onClick={toggleSidebar}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}
      
      <aside 
        className={cn(
          "bg-white h-screen flex flex-col top-0 left-0 z-40 transition-all duration-300 ease-in-out border-r border-gray-200",
          isOpen ? "w-64 translate-x-0" : isMobile ? "w-64 -translate-x-full" : "w-20"
        )}
      >
        <div className={cn(
          "flex items-center justify-center py-5 border-b border-gray-200 transition-all duration-300 ease-out",
          !isOpen && !isMobile && "py-5"
        )}>
          <h1 className={cn(
            "font-display font-bold text-xl text-blue-800 whitespace-nowrap transition-all duration-300 ease-out",
            !isOpen && !isMobile && "scale-0 opacity-0 w-0"
          )}>
            Unclic
          </h1>
          {!isOpen && !isMobile && (
            <h1 className="font-display font-bold text-xl text-blue-800">U</h1>
          )}
        </div>
        
        <nav className="mt-2 space-y-1 px-3 flex-1 overflow-y-auto">
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
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                U
              </div>
              <div>
                <p className="text-gray-800 font-medium text-sm">Salão Exemplo</p>
                <p className="text-gray-500 text-xs">Admin</p>
              </div>
            </div>
          </div>
        )}

        {!isOpen && !isMobile && (
          <div className="p-4 border-t border-gray-200 flex justify-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
              U
            </div>
          </div>
        )}
        
        <div className={cn(
          "p-3 border-t border-gray-200",
          !isOpen && !isMobile && "flex justify-center"
        )}>
          <button className={cn(
            "w-full py-2 px-3 rounded-md flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors",
            !isOpen && !isMobile && "justify-center p-2"
          )}>
            <LogOut size={18} />
            {(isOpen || isMobile) && <span className="text-sm">Sair</span>}
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
