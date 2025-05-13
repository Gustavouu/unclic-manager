import React, { useState } from 'react';
import { useServices } from '@/hooks/useServices';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTenant } from '@/contexts/TenantContext';
import BusinessSetupAlert from '@/components/dashboard/BusinessSetupAlert';

export function ServicesTab() {
  const { services, isLoading, error, refreshServices } = useServices();
  const { businessId } = useTenant();
  
  const [showAddService, setShowAddService] = useState(false);

  const handleAddService = () => {
    setShowAddService(true);
  };

  if (!businessId) {
    return <BusinessSetupAlert />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando serviços...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <div className="mt-2">
            <Button onClick={refreshServices} variant="outline" size="sm">
              Tentar novamente
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Serviços</h3>
        <Button onClick={handleAddService}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Serviço
        </Button>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-center">
              <p className="text-muted-foreground">Nenhum serviço cadastrado.</p>
              <Button onClick={handleAddService} className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Adicionar seu primeiro serviço
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <CardTitle>{service.nome}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Preço:</span>
                    <span>R$ {service.preco.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Duração:</span>
                    <span>{service.duracao} minutos</span>
                  </div>
                  {service.descricao && (
                    <div className="pt-2">
                      <span className="text-sm font-medium">Descrição:</span>
                      <p className="text-sm text-muted-foreground">{service.descricao}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  Editar
                </Button>
                <Button variant="destructive" size="sm">
                  Remover
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* TODO: Add service form modal here when showAddService is true */}
    </div>
  );
}
