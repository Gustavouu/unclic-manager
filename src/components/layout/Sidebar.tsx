
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
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
  LogOut,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
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
              "sidebar-item h-10 text-xs", 
              isActive ? "bg-blue-50 text-blue-700 before:bg-blue-600" : "hover:bg-gray-50 text-gray-700"
            )}
          >
            <div className="sidebar-icon text-[14px]">{icon}</div>
            <span className="sidebar-label text-[13px]">{label}</span>
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
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(!isMobile);
  
  const pathName = location.pathname;
  
  const routes = [
    { icon: <LayoutDashboard size={16} />, label: "Dashboard", path: "/dashboard" },
    { icon: <Calendar size={16} />, label: "Agendamentos", path: "/appointments" },
    { icon: <Users size={16} />, label: "Clientes", path: "/clients" },
    { icon: <UserRound size={16} />, label: "Colaboradores", path: "/professionals" },
    { icon: <ShoppingBag size={16} />, label: "Estoque", path: "/inventory" },
    { icon: <Banknote size={16} />, label: "Financeiro", path: "/finance" },
    { icon: <Scissors size={16} />, label: "Serviços", path: "/services" },
    { icon: <MessageSquare size={16} />, label: "Mensagens", path: "/messages" },
    { icon: <BarChart2 size={16} />, label: "Relatórios", path: "/reports" },
    { icon: <Settings size={16} />, label: "Configurações", path: "/settings" },
    { icon: <HelpCircle size={16} />, label: "Ajuda", path: "/help" },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      {isMobile && (
        <button 
          className="fixed z-50 top-3 left-3 p-1.5 bg-white rounded-lg text-gray-700 shadow-md"
          onClick={toggleSidebar}
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      )}
      
      <aside 
        className={cn(
          "fixed bg-white h-screen flex flex-col top-0 left-0 z-40 transition-all duration-300 ease-in-out border-r border-gray-200",
          isOpen ? "w-60 translate-x-0" : isMobile ? "w-60 -translate-x-full" : "w-16"
        )}
      >
        <div className={cn(
          "flex items-center justify-center py-4 border-b border-gray-200 transition-all duration-300 ease-out",
          !isOpen && !isMobile && "py-4"
        )}>
          <h1 className={cn(
            "font-display font-bold text-lg text-blue-800 whitespace-nowrap transition-all duration-300 ease-out",
            !isOpen && !isMobile && "scale-0 opacity-0 w-0"
          )}>
            Unclic
          </h1>
          {!isOpen && !isMobile && (
            <h1 className="font-display font-bold text-lg text-blue-800">U</h1>
          )}
        </div>
        
        <nav className="mt-1 space-y-0.5 px-2 flex-1 overflow-y-auto">
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
        
        <div className="p-3 border-t border-gray-200">
          {isOpen ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-xs">
                  U
                </div>
                <div>
                  <p className="text-gray-800 font-medium text-xs">Salão Exemplo</p>
                  <p className="text-gray-500 text-xs">Admin</p>
                </div>
              </div>
              <button 
                onClick={handleSignOut}
                className="p-1.5 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                title="Sair"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-xs">
                U
              </div>
              {!isMobile && (
                <button 
                  onClick={handleSignOut}
                  className="p-1.5 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  title="Sair"
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
      
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 backdrop-blur-sm transition-all duration-300 ease-in-out"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};
