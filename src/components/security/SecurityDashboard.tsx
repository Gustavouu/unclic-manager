
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SecurityMetrics } from './SecurityMetrics';
import { PermissionsList } from './PermissionsList';
import { UserPermissionsManager } from './UserPermissionsManager';
import { usePermissions } from '@/hooks/security/usePermissions';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const SecurityDashboard = () => {
  const { permissions, loading, isAdmin, hasPermission } = usePermissions();

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  const hasBasicPermissions = hasPermission('clients.view') || hasPermission('appointments.view');
  const securityStatus = isAdmin ? 'excellent' : hasBasicPermissions ? 'good' : 'limited';

  return (
    <div className="space-y-8">
      {/* Status de Segurança */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Status de Segurança
          </CardTitle>
          <CardDescription>
            Visão geral do seu nível de acesso e permissões
          </CardDescription>
        </CardHeader>
        <CardContent>
          {securityStatus === 'excellent' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Excelente!</strong> Você tem acesso administrativo completo ao sistema.
              </AlertDescription>
            </Alert>
          )}
          
          {securityStatus === 'good' && (
            <Alert className="border-blue-200 bg-blue-50">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Bom!</strong> Você tem permissões adequadas para usar o sistema.
              </AlertDescription>
            </Alert>
          )}
          
          {securityStatus === 'limited' && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Acesso Limitado.</strong> Suas permissões podem estar sendo configuradas. Entre em contato com um administrador se precisar de mais acesso.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Métricas de Segurança */}
      <SecurityMetrics />

      {/* Grade de Componentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de Permissões */}
        <PermissionsList />
        
        {/* Gerenciador de Permissões (só para admins) */}
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Acesso Administrativo</CardTitle>
              <CardDescription>
                Você tem acesso completo para gerenciar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Como administrador, você pode gerenciar usuários, permissões e configurações do sistema.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Gerenciador de Permissões Completo (apenas para admins) */}
      {isAdmin && <UserPermissionsManager />}
    </div>
  );
};
