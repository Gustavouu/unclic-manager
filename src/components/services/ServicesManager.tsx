
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useServicesList } from '@/hooks/services/useServicesList';
import { ServicesTable } from './ServicesTable';
import { ServiceFormDialog } from './ServiceFormDialog';

export const ServicesManager: React.FC = () => {
  const { services, isLoading, refetch } = useServicesList();
  const [showNewServiceDialog, setShowNewServiceDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = services.filter(service => {
    const name = service.name || '';
    const description = service.description || '';
    const category = service.category || '';
    
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleServiceSaved = () => {
    setShowNewServiceDialog(false);
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Serviços</h1>
          <p className="text-gray-600">Gerencie os serviços do seu negócio</p>
        </div>
        <Button onClick={() => setShowNewServiceDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Serviço
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome, descrição ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Services List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Serviços ({filteredServices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ServicesTable
            services={filteredServices}
            isLoading={isLoading}
            onRefresh={refetch}
          />
        </CardContent>
      </Card>
      
      <ServiceFormDialog
        open={showNewServiceDialog}
        onOpenChange={setShowNewServiceDialog}
        onServiceSaved={handleServiceSaved}
      />
    </div>
  );
};
