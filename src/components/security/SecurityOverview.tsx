
import React from 'react';
import { SecurityMetrics } from './SecurityMetrics';
import { UserPermissionsManager } from './UserPermissionsManager';
import { PermissionsList } from './PermissionsList';
import { SecurityDashboard } from './SecurityDashboard';
import { PermissionGuard } from './PermissionGuard';

export const SecurityOverview = () => {
  return (
    <div className="space-y-8">
      {/* Métricas de Segurança */}
      <PermissionGuard 
        permission="admin.full_access"
        fallback={
          <SecurityMetrics />
        }
        showError={false}
      >
        <SecurityMetrics />
      </PermissionGuard>

      {/* Dashboard Principal de Segurança */}
      <PermissionGuard 
        permission="admin.full_access"
        fallback={
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PermissionsList />
          </div>
        }
        showError={false}
      >
        <SecurityDashboard />
      </PermissionGuard>

      {/* Gerenciador de Permissões (apenas para admins) */}
      <PermissionGuard 
        permission="admin.full_access"
        showError={false}
      >
        <UserPermissionsManager />
      </PermissionGuard>
    </div>
  );
};
