
import * as React from "react";
import {
  CalendarRange,
  LayoutDashboard,
  Package,
  Scissors,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { SidebarGroup } from "./SidebarGroup";
import { SidebarMenuItem } from "./SidebarMenu";
import { SettingsCollapsible } from "./SettingsCollapsible";

export function MenuSections() {
  const pathname = useLocation().pathname;
  
  return (
    <>
      <SidebarGroup title="Menu">
        <SidebarMenuItem
          icon={LayoutDashboard}
          title="Dashboard"
          isLink
          to="/dashboard"
          active={pathname === "/dashboard"}
        />
      </SidebarGroup>

      <SidebarGroup title="Gestão">
        <SidebarMenuItem
          icon={CalendarRange}
          title="Agenda"
          isLink
          to="/appointments"
          active={pathname === "/appointments"}
        />
        <SidebarMenuItem
          icon={UserRound}
          title="Clientes"
          isLink
          to="/clients"
          active={pathname === "/clients"}
        />
        <SidebarMenuItem
          icon={Scissors}
          title="Serviços"
          isLink
          to="/services"
          active={pathname === "/services"}
        />
        <SidebarMenuItem
          icon={Users}
          title="Profissionais"
          isLink
          to="/professionals"
          active={pathname === "/professionals"}
        />
        <SidebarMenuItem
          icon={Package}
          title="Estoque"
          isLink
          to="/inventory"
          active={pathname === "/inventory"}
        />
        <SidebarMenuItem
          icon={WalletCards}
          title="Financeiro"
          isLink
          to="/finance"
          active={pathname === "/finance"}
        />
      </SidebarGroup>

      <SidebarGroup title="Configurações">
        <SettingsCollapsible />
      </SidebarGroup>
    </>
  );
}
