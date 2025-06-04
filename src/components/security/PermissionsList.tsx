
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePermissions } from '@/hooks/security/usePermissions';
import { Shield, Lock, Eye, Edit, Plus, Trash2, Settings, BarChart3 } from 'lucide-react';

const getPermissionIcon = (permission: string) => {
  if (permission.includes('view')) return <Eye className="h-3 w-3" />;
  if (permission.includes('create')) return <Plus className="h-3 w-3" />;
  if (permission.includes('edit')) return <Edit className="h-3 w-3" />;
  if (permission.includes('delete')) return <Trash2 className="h-3 w-3" />;
  if (permission.includes('settings')) return <Settings className="h-3 w-3" />;
  if (permission.includes('reports')) return <BarChart3 className="h-3 w-3" />;
  if (permission.includes('admin')) return <Shield className="h-3 w-3" />;
  return <Lock className="h-3 w-3" />;
};

const getPermissionLabel = (permission: string) => {
  const labels: { [key: string]: string } = {
    'appointments.view': 'Ver Agendamentos',
    'appointments.create': 'Criar Agendamentos', 
    'appointments.edit': 'Editar Agendamentos',
    'appointments.delete': 'Excluir Agendamentos',
    'clients.view': 'Ver Clientes',
    'clients.create': 'Criar Clientes',
    'clients.edit': 'Editar Clientes',
    'clients.delete': 'Excluir Clientes',
    'services.view': 'Ver Serviços',
    'services.create': 'Criar Serviços',
    'services.edit': 'Editar Serviços',
    'services.delete': 'Excluir Serviços',
    'professionals.view': 'Ver Profissionais',
    'professionals.create': 'Criar Profissionais',
    'professionals.edit': 'Editar Profissionais',
    'professionals.delete': 'Excluir Profissionais',
    'financial.view': 'Ver Financeiro',
    'financial.create': 'Criar Transações',
    'financial.edit': 'Editar Transações',
    'financial.delete': 'Excluir Transações',
    'reports.view': 'Ver Relatórios',
    'inventory.view': 'Ver Estoque',
    'inventory.create': 'Criar Itens',
    'inventory.edit': 'Editar Itens',
    'inventory.delete': 'Excluir Itens',
    'settings.view': 'Ver Configurações',
    'settings.edit': 'Editar Configurações',
    'admin.full_access': 'Acesso Administrativo'
  };
  
  return labels[permission] || permission;
};

const getPermissionVariant = (permission: string): "default" | "secondary" | "destructive" | "outline" => {
  if (permission.includes('admin')) return 'destructive';
  if (permission.includes('delete')) return 'outline';
  if (permission.includes('edit') || permission.includes('create')) return 'default';
  return 'secondary';
};

export const PermissionsList = () => {
  const { permissions, loading, isAdmin } = usePermissions();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Suas Permissões</CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (permissions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Suas Permissões
          </CardTitle>
          <CardDescription>
            Nenhuma permissão encontrada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Sem permissões
            </h3>
            <p className="text-gray-500">
              Entre em contato com um administrador para solicitar acesso.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Agrupar permissões por módulo
  const groupedPermissions = permissions.reduce((groups, permission) => {
    const module = permission.split('.')[0];
    if (!groups[module]) {
      groups[module] = [];
    }
    groups[module].push(permission);
    return groups;
  }, {} as Record<string, string[]>);

  const moduleNames: { [key: string]: string } = {
    appointments: 'Agendamentos',
    clients: 'Clientes', 
    services: 'Serviços',
    professionals: 'Profissionais',
    financial: 'Financeiro',
    reports: 'Relatórios',
    inventory: 'Estoque',
    settings: 'Configurações',
    admin: 'Administração'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Suas Permissões
        </CardTitle>
        <CardDescription>
          {isAdmin ? 'Acesso administrativo completo' : `${permissions.length} permissões ativas`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
            <div key={module} className="border rounded-lg p-4">
              <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-gray-700">
                {moduleNames[module] || module}
              </h4>
              <div className="flex flex-wrap gap-2">
                {modulePermissions.map(permission => (
                  <Badge 
                    key={permission} 
                    variant={getPermissionVariant(permission)}
                    className="text-xs flex items-center gap-1"
                  >
                    {getPermissionIcon(permission)}
                    {getPermissionLabel(permission)}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
