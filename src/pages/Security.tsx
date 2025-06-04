
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { SecurityDashboard } from '@/components/security/SecurityDashboard';
import { PermissionGuard } from '@/components/security/PermissionGuard';

const Security = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Segurança"
        description="Gerencie permissões, funções e monitore atividades de segurança"
      />
      
      <PermissionGuard 
        permission="admin.full_access"
        showError={true}
      >
        <SecurityDashboard />
      </PermissionGuard>
    </div>
  );
};

export default Security;
