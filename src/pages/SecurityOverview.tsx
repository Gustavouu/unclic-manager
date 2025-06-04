
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { SecurityOverview } from '@/components/security/SecurityOverview';
import { SecurityProvider } from '@/contexts/SecurityProvider';

const SecurityOverviewPage = () => {
  return (
    <SecurityProvider>
      <div className="space-y-6">
        <PageHeader
          title="Visão Geral de Segurança"
          description="Monitore e gerencie a segurança do sistema"
        />
        
        <SecurityOverview />
      </div>
    </SecurityProvider>
  );
};

export default SecurityOverviewPage;
