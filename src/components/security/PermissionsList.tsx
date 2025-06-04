
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePermissions } from '@/hooks/security/usePermissions';
import { Check, X } from 'lucide-react';

const permissionLabels = {
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
  'admin.full_access': 'Acesso Administrativo Completo'
};

const permissionModules = {
  'appointments': ['appointments.view', 'appointments.create', 'appointments.edit', 'appointments.delete'],
  'clients': ['clients.view', 'clients.create', 'clients.edit', 'clients.delete'],
  'services': ['services.view', 'services.create', 'services.edit', 'services.delete'],
  'professionals': ['professionals.view', 'professionals.create', 'professionals.edit', 'professionals.delete'],
  'financial': ['financial.view', 'financial.create', 'financial.edit', 'financial.delete'],
  'reports': ['reports.view'],
  'inventory': ['inventory.view', 'inventory.create', 'inventory.edit', 'inventory.delete'],
  'settings': ['settings.view', 'settings.edit'],
  'admin': ['admin.full_access']
};

export const PermissionsList = () => {
  const { permissions, loading, hasPermission } = usePermissions();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Suas Permissões</CardTitle>
          <CardDescription>Carregando permissões...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suas Permissões</CardTitle>
        <CardDescription>
          Permissões ativas para sua conta neste negócio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(permissionModules).map(([module, modulePermissions]) => (
            <div key={module}>
              <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground mb-3">
                {module === 'appointments' && 'Agendamentos'}
                {module === 'clients' && 'Clientes'}
                {module === 'services' && 'Serviços'}
                {module === 'professionals' && 'Profissionais'}
                {module === 'financial' && 'Financeiro'}
                {module === 'reports' && 'Relatórios'}
                {module === 'inventory' && 'Estoque'}
                {module === 'settings' && 'Configurações'}
                {module === 'admin' && 'Administração'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {modulePermissions.map((permission) => (
                  <div 
                    key={permission}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      hasPermission(permission as any)
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <span className="text-sm">
                      {permissionLabels[permission as keyof typeof permissionLabels]}
                    </span>
                    {hasPermission(permission as any) ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
