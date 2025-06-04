
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOptimizedTenant } from '@/contexts/OptimizedTenantContext';
import { usePermissions } from '@/hooks/security/usePermissions';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { 
  Home,
  Calendar,
  Users,
  Briefcase,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentBusiness } = useOptimizedTenant();
  const { hasPermission, isAdmin } = usePermissions();

  const menuItems = [
    {
      title: 'Dashboard',
      url: '/',
      icon: Home,
      show: true
    },
    {
      title: 'Agendamentos',
      url: '/appointments',
      icon: Calendar,
      show: hasPermission('appointments.view')
    },
    {
      title: 'Clientes',
      url: '/clients',
      icon: Users,
      show: hasPermission('clients.view')
    },
    {
      title: 'Serviços',
      url: '/services',
      icon: Briefcase,
      show: hasPermission('services.view')
    },
    {
      title: 'Relatórios',
      url: '/reports',
      icon: BarChart3,
      show: hasPermission('reports.view')
    },
    {
      title: 'Configurações',
      url: '/settings',
      icon: Settings,
      show: hasPermission('settings.view')
    },
    {
      title: 'Segurança',
      url: '/security',
      icon: Shield,
      show: isAdmin
    },
  ];

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/login');
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-sm truncate">
              {currentBusiness?.name || 'Unclic Manager'}
            </h2>
            {isAdmin && (
              <Badge variant="secondary" className="text-xs">
                Admin
              </Badge>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems
                .filter(item => item.show)
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === item.url}
                    >
                      <button
                        onClick={() => navigate(item.url)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
