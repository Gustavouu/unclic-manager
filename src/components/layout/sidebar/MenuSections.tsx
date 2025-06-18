
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Scissors,
  UserCheck,
  DollarSign, 
  BarChart3, 
  Settings,
  Package,
  CreditCard,
  FileText,
  Megaphone
} from 'lucide-react';

interface MenuItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string | number;
  description?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: 'Principal',
    items: [
      {
        title: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
        description: 'Visão geral do negócio'
      },
      {
        title: 'Agendamentos',
        icon: Calendar,
        href: '/appointments',
        description: 'Gerencie sua agenda'
      }
    ]
  },
  {
    title: 'Gestão',
    items: [
      {
        title: 'Clientes',
        icon: Users,
        href: '/clients',
        description: 'Base de clientes'
      },
      {
        title: 'Serviços',
        icon: Scissors,
        href: '/services',
        description: 'Catálogo de serviços'
      },
      {
        title: 'Profissionais',
        icon: UserCheck,
        href: '/professionals',
        description: 'Equipe de trabalho'
      },
      {
        title: 'Estoque',
        icon: Package,
        href: '/inventory',
        description: 'Controle de produtos'
      }
    ]
  },
  {
    title: 'Financeiro',
    items: [
      {
        title: 'Financeiro',
        icon: DollarSign,
        href: '/finance',
        description: 'Receitas e despesas'
      },
      {
        title: 'Pagamentos',
        icon: CreditCard,
        href: '/payments',
        description: 'Métodos de pagamento'
      },
      {
        title: 'Relatórios',
        icon: BarChart3,
        href: '/reports',
        description: 'Análises e insights'
      }
    ]
  },
  {
    title: 'Sistema',
    items: [
      {
        title: 'Marketing',
        icon: Megaphone,
        href: '/marketing',
        description: 'Campanhas e promoções'
      },
      {
        title: 'Documentos',
        icon: FileText,
        href: '/documents',
        description: 'Contratos e termos'
      },
      {
        title: 'Configurações',
        icon: Settings,
        href: '/settings',
        description: 'Configurações do sistema'
      }
    ]
  }
];

export const MenuSections: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <nav className="space-y-6 px-3">
      {menuSections.map((section) => (
        <div key={section.title} className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {section.title}
          </h3>
          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    active && 'bg-accent text-accent-foreground shadow-sm'
                  )}
                  title={item.description}
                >
                  <Icon className={cn(
                    'h-4 w-4 flex-shrink-0',
                    active ? 'text-accent-foreground' : 'text-muted-foreground'
                  )} />
                  <span className="truncate">{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
};
