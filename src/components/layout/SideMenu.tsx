
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  PackageOpen,
  Wallet,
  CreditCard,
  BarChart2,
  Settings,
  Palette
} from 'lucide-react';

interface MenuItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const MenuItem = ({ to, icon, label }: MenuItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors
        ${isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'hover:bg-accent hover:text-accent-foreground'}`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

export const SideMenu = () => {
  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground">
          MENU
        </h2>
        <div className="space-y-1">
          <MenuItem
            to="/dashboard"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
          />
        </div>
      </div>
      
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground">
          GESTÃO
        </h2>
        <div className="space-y-1">
          <MenuItem
            to="/appointments"
            icon={<Calendar size={18} />}
            label="Agenda"
          />
          <MenuItem
            to="/services"
            icon={<Scissors size={18} />}
            label="Serviços"
          />
          <MenuItem
            to="/clients"
            icon={<Users size={18} />}
            label="Clientes"
          />
          <MenuItem
            to="/professionals"
            icon={<Users size={18} />}
            label="Profissionais"
          />
          <MenuItem
            to="/inventory"
            icon={<PackageOpen size={18} />}
            label="Estoque"
          />
          <MenuItem
            to="/finances"
            icon={<Wallet size={18} />}
            label="Financeiro"
          />
          <MenuItem
            to="/payments"
            icon={<CreditCard size={18} />}
            label="Pagamentos"
          />
          <MenuItem
            to="/reports"
            icon={<BarChart2 size={18} />}
            label="Relatórios"
          />
          <MenuItem
            to="/settings"
            icon={<Settings size={18} />}
            label="Configurações"
          />
        </div>
      </div>
      
      <div className="mt-auto px-3 py-2">
        <MenuItem
          to="/theme"
          icon={<Palette size={18} />}
          label="Tema"
        />
      </div>
    </div>
  );
};
