
import React from 'react';
import { useMultiTenant } from '@/contexts/MultiTenantContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Eye, EyeOff } from 'lucide-react';

export const BusinessDebugInfo: React.FC = () => {
  const { user } = useAuthContext();
  const {
    currentBusiness,
    availableBusinesses,
    isLoading,
    error,
    refreshBusinesses,
    hasMultipleBusinesses,
  } = useMultiTenant();

  const [showDebug, setShowDebug] = React.useState(false);

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDebug(true)}
          className="shadow-lg"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Debug Info - Multi-Tenancy</CardTitle>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshBusinesses}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDebug(false)}
                className="h-6 w-6 p-0"
              >
                <EyeOff className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <CardDescription className="text-xs">
            Informações de depuração do sistema multi-tenant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          {/* User Info */}
          <div>
            <strong>Usuário:</strong>
            <div className="ml-2 text-muted-foreground">
              ID: {user?.id || 'N/A'}
            </div>
            <div className="ml-2 text-muted-foreground">
              Email: {user?.email || 'N/A'}
            </div>
          </div>

          {/* Loading State */}
          <div>
            <strong>Estado:</strong>
            <Badge variant={isLoading ? 'default' : 'secondary'} className="ml-2 text-xs">
              {isLoading ? 'Carregando' : 'Carregado'}
            </Badge>
          </div>

          {/* Error State */}
          {error && (
            <div>
              <strong>Erro:</strong>
              <div className="ml-2 text-red-600 text-xs">{error}</div>
            </div>
          )}

          {/* Current Business */}
          <div>
            <strong>Negócio Atual:</strong>
            {currentBusiness ? (
              <div className="ml-2 text-muted-foreground">
                <div>Nome: {currentBusiness.name}</div>
                <div>ID: {currentBusiness.id}</div>
                <div>Função: {currentBusiness.role}</div>
                <div>Status: {currentBusiness.status}</div>
              </div>
            ) : (
              <div className="ml-2 text-muted-foreground">Nenhum</div>
            )}
          </div>

          {/* Available Businesses */}
          <div>
            <strong>Negócios Disponíveis:</strong>
            <div className="ml-2 text-muted-foreground">
              Total: {availableBusinesses.length}
            </div>
            <div className="ml-2 text-muted-foreground">
              Múltiplos: {hasMultipleBusinesses ? 'Sim' : 'Não'}
            </div>
          </div>

          {/* Businesses List */}
          {availableBusinesses.length > 0 && (
            <div>
              <strong>Lista:</strong>
              <div className="ml-2 space-y-1 max-h-32 overflow-y-auto">
                {availableBusinesses.map((business, index) => (
                  <div key={business.id} className="text-muted-foreground">
                    {index + 1}. {business.name} ({business.role})
                    {currentBusiness?.id === business.id && (
                      <Badge variant="default" className="ml-1 text-xs">Atual</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Storage Info */}
          <div>
            <strong>Storage:</strong>
            <div className="ml-2 text-muted-foreground">
              Business ID: {localStorage.getItem('unclic_current_business_id') || 'N/A'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
