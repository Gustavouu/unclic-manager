
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePermissions } from '@/hooks/security/usePermissions';
import { useRoles } from '@/hooks/security/useRoles';
import { Users, Shield, Plus, Edit } from 'lucide-react';

export const UserPermissionsManager = () => {
  const { permissions, loading: permissionsLoading, hasPermission, isAdmin } = usePermissions();
  const { roles, loading: rolesLoading } = useRoles();
  const [selectedRole, setSelectedRole] = useState<string>('');

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Shield className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
            <p className="text-muted-foreground">
              Você não tem permissão para gerenciar usuários e permissões.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gerenciador de Permissões
          </CardTitle>
          <CardDescription>
            Gerencie funções e permissões dos usuários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Funções Disponíveis */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Funções Disponíveis</h3>
              {rolesLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{role.name}</h4>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={role.is_system ? 'default' : 'secondary'}>
                            {role.role_type}
                          </Badge>
                          {role.is_system && (
                            <Badge variant="outline" className="text-xs">
                              Sistema
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedRole(role.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Nova Função
              </Button>
            </div>

            {/* Permissões por Módulo */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Suas Permissões</h3>
              {permissionsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Agrupamento por módulo */}
                  {['appointments', 'clients', 'services', 'professionals', 'financial', 'reports', 'inventory', 'settings', 'admin'].map(module => {
                    const modulePermissions = permissions.filter(p => p.startsWith(`${module}.`));
                    
                    if (modulePermissions.length === 0) return null;
                    
                    return (
                      <div key={module} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3 capitalize">
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
                        <div className="flex flex-wrap gap-2">
                          {modulePermissions.map(permission => (
                            <Badge key={permission} variant="secondary" className="text-xs">
                              {permission.split('.')[1]}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
