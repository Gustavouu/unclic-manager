
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Scissors } from 'lucide-react';
import { OnboardingRedirect } from '@/components/auth/OnboardingRedirect';

const Services = () => {
  return (
    <OnboardingRedirect>
      <div className="container mx-auto py-6 px-4">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Serviços</h1>
              <p className="text-gray-600">Gerencie os serviços do seu negócio</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Serviço
            </Button>
          </div>

          {/* Services List */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Serviços</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Scissors className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum serviço cadastrado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comece adicionando os serviços que seu negócio oferece
                </p>
                <div className="mt-6">
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar Primeiro Serviço
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </OnboardingRedirect>
  );
};

export default Services;
