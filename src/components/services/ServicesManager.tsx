
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Filter } from 'lucide-react';
import { useServicesList } from '@/hooks/services/useServicesList';
import { ServicesTable } from './ServicesTable';
import { ServiceFormDialog } from './ServiceFormDialog';
import { ServiceService } from '@/services/service/serviceService';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';

export const ServicesManager: React.FC = () => {
  const { services, isLoading, refetch, searchServices } = useServicesList();
  const [showNewServiceDialog, setShowNewServiceDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const { businessId } = useCurrentBusiness();

  const serviceService = ServiceService.getInstance();

  useEffect(() => {
    const loadCategories = async () => {
      if (businessId) {
        try {
          const cats = await serviceService.getCategories(businessId);
          setCategories(cats);
        } catch (error) {
          console.error('Error loading categories:', error);
        }
      }
    };

    loadCategories();
  }, [businessId, services]);

  const handleSearch = () => {
    const category = selectedCategory === 'all' ? undefined : selectedCategory;
    if (searchTerm.trim() || category) {
      searchServices(searchTerm.trim(), category);
    } else {
      refetch();
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    refetch();
  };

  const handleServiceSaved = () => {
    setShowNewServiceDialog(false);
    refetch();
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = searchTerm === '' || 
      (service.name || service.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description || service.descricao || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.category || service.categoria || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || 
      (service.category || service.categoria) === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Serviços</h1>
          <p className="text-gray-600">Gerencie os serviços do seu negócio</p>
        </div>
        <ServiceFormDialog
          open={showNewServiceDialog}
          onOpenChange={setShowNewServiceDialog}
          onServiceSaved={handleServiceSaved}
        />
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, descrição ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button onClick={handleSearch} variant="default">
                Buscar
              </Button>
              
              {(searchTerm || selectedCategory !== 'all') && (
                <Button onClick={handleClearFilters} variant="outline">
                  Limpar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Serviços ({filteredServices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ServicesTable
            services={filteredServices}
            isLoading={isLoading}
            onRefresh={refetch}
          />
        </CardContent>
      </Card>
    </div>
  );
};
