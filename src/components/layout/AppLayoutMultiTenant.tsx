
import React from 'react';
import { BusinessSelector } from '@/components/business/BusinessSelector';
import { useMultiTenant } from '@/contexts/MultiTenantContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

interface AppLayoutMultiTenantProps {
  children: React.ReactNode;
}

export const AppLayoutMultiTenant: React.FC<AppLayoutMultiTenantProps> = ({ children }) => {
  const { currentBusiness, isLoading, error, hasMultipleBusinesses } = useMultiTenant();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Carregando informações do negócio...</p>
        </div>
      </div>
    );
  }

  if (error && !currentBusiness) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Business Selector Header - only show if user has multiple businesses */}
      {hasMultipleBusinesses && (
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Negócio Atual:
                </h2>
                <BusinessSelector variant="compact" />
              </div>
              {currentBusiness && (
                <div className="text-xs text-muted-foreground">
                  ID: {currentBusiness.id.substring(0, 8)}...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};
