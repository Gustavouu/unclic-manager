
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePermissions } from '@/hooks/security/usePermissions';
import { useRoles } from '@/hooks/security/useRoles';
import { useAuditLog } from '@/hooks/security/useAuditLog';
import { Shield, Users, Activity, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const SecurityDashboard = () => {
  const { permissions, loading: permissionsLoading, isAdmin } = usePermissions();
  const { roles, loading: rolesLoading } = useRoles();
  const { logs, loading: logsLoading } = useAuditLog(10);

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
            <p className="text-muted-foreground">
              Você não tem permissão para acessar o painel de segurança.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suas Permissões</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {permissionsLoading ? '...' : permissions.length}
            </div>
            <p className="text-xs text-muted-foreground">
              permissões ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funções no Sistema</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rolesLoading ? '...' : roles.length}
            </div>
            <p className="text-xs text-muted-foreground">
              funções configuradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atividades Recentes</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logsLoading ? '...' : logs.length}
            </div>
            <p className="text-xs text-muted-foreground">
              ações registradas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Funções do Sistema</CardTitle>
            <CardDescription>
              Funções configuradas para seu negócio
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rolesLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {roles.map((role) => (
                  <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{role.name}</h4>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                    <Badge variant={role.is_system ? 'default' : 'secondary'}>
                      {role.role_type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Log de Auditoria</CardTitle>
            <CardDescription>
              Últimas atividades registradas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {logsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between text-sm p-2 border rounded">
                    <div className="flex-1">
                      <span className="font-medium">{log.action}</span>
                      {log.table_name && (
                        <span className="text-muted-foreground ml-2">
                          em {log.table_name}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(log.created_at), 'dd/MM HH:mm', { locale: ptBR })}
                    </div>
                  </div>
                ))}
                {logs.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhuma atividade registrada
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
