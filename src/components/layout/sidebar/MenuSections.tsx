
import * as React from "react";
import {
  CalendarRange,
  LayoutDashboard,
  Package,
  Scissors,
  UserRound,
  Users,
  WalletCards,
  Settings,
  BarChart3,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { SidebarGroup } from "./SidebarGroup";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function MenuSections() {
  const { pathname } = useLocation();

  const menuItems = [
    {
      group: "Menu",
      items: [
        { icon: LayoutDashboard, title: "Dashboard", path: "/dashboard" }
      ]
    },
    {
      group: "Gestão",
      items: [
        { icon: CalendarRange, title: "Agenda", path: "/appointments" },
        { icon: UserRound, title: "Clientes", path: "/clients" },
        { icon: Scissors, title: "Serviços", path: "/services" },
        { icon: Users, title: "Profissionais", path: "/professionals" },
        { icon: Package, title: "Estoque", path: "/inventory" },
        { icon: WalletCards, title: "Financeiro", path: "/finance" },
        { icon: BarChart3, title: "Relatórios", path: "/reports" },
        { icon: Settings, title: "Configurações", path: "/settings" }
      ]
    }
  ];
  
  return (
    <>
      {menuItems.map((section) => (
        <SidebarGroup title={section.group} key={section.group}>
          <div className="space-y-1">
            {section.items.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </SidebarGroup>
      ))}
      
      <div className="mt-auto px-3 py-2">
        <div className="flex items-center justify-between rounded-md p-2">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="text-sm">Tema</span>
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </>
  );
}
