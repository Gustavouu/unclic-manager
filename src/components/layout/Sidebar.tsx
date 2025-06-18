
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Scissors,
  UserCheck,
  DollarSign, 
  BarChart3, 
  Settings,
  LogOut
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
    },
    {
      title: 'Clientes',
      icon: Users,
      href: '/clients',
    },
    {
      title: 'Agendamentos',
      icon: Calendar,
      href: '/appointments',
    },
    {
      title: 'Serviços',
      icon: Scissors,
      href: '/services',
    },
    {
      title: 'Profissionais',
      icon: UserCheck,
      href: '/professionals',
    },
    {
      title: 'Financeiro',
      icon: DollarSign,
      href: '/finance',
    },
    {
      title: 'Relatórios',
      icon: BarChart3,
      href: '/reports',
    },
    {
      title: 'Configurações',
      icon: Settings,
      href: '/settings',
    },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <div className={cn('pb-12', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Menu
          </h2>
          <div className="space-y-1">
            <ScrollArea className="h-[300px] px-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Button
                    key={item.href}
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start',
                      isActive && 'bg-muted font-medium'
                    )}
                    onClick={() => navigate(item.href)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Button>
                );
              })}
            </ScrollArea>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-3 right-3">
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
}
