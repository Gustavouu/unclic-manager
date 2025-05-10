
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Package, 
  BarChart3,
  Settings,
  CreditCard,
  Scissors
} from "lucide-react";
import { MainNav } from "@/components/main-nav";
import { StockNotifications } from "@/components/inventory/StockNotifications";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Sidebar() {
  const { pathname } = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Calendar, label: "Agendamentos", path: "/appointments" },
    { icon: Scissors, label: "Serviços", path: "/services" },
    { icon: Users, label: "Clientes", path: "/clients" },
    { icon: Users, label: "Profissionais", path: "/professionals" },
    { icon: Package, label: "Estoque", path: "/inventory" },
    { icon: CreditCard, label: "Financeiro", path: "/finance" },
    { icon: BarChart3, label: "Relatórios", path: "/reports" },
    { icon: Settings, label: "Configurações", path: "/settings" },
  ];

  return (
    <div className="border-r bg-white dark:bg-neutral-950 flex-col fixed inset-y-0 w-60 z-20 shadow-sm hidden md:flex">
      <div className="px-4 py-4 border-b">
        <MainNav className="mx-auto" />
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive 
                    ? "bg-blue-600 text-white font-medium shadow-sm" 
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      
      <div className="mt-auto border-t p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between rounded-md p-2 bg-gray-50 dark:bg-neutral-900">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="text-sm">Tema</span>
            </div>
            <ThemeSwitcher />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              U
            </div>
            <div className="truncate">
              <p className="text-sm font-medium">Usuário Demo</p>
              <p className="text-xs text-gray-500">admin@unclic.app</p>
            </div>
            <div className="ml-auto">
              <StockNotifications />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
