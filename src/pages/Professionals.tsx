
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Users, Star, Edit, Trash2 } from 'lucide-react';
import { OnboardingRedirect } from '@/components/auth/OnboardingRedirect';
import { ProfessionalFormDialog } from '@/components/professionals/ProfessionalFormDialog';
import { useProfessionalsList } from '@/hooks/professionals/useProfessionalsList';
import { useProfessionalsOperations } from '@/hooks/professionals/useProfessionalsOperations';
import type { Professional } from '@/types/professional';

const Professionals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { professionals, isLoading, refetch } = useProfessionalsList();
  const { deleteProfessional } = useProfessionalsOperations();

  const filteredProfessionals = professionals.filter(professional =>
    professional.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professional.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professional.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      default:
        return status;
    }
  };

  const handleEdit = (professional: Professional) => {
    setEditingProfessional(professional);
    setIsDialogOpen(true);
  };

  const handleDelete = async (professional: Professional) => {
    if (window.confirm(`Tem certeza que deseja excluir ${professional.name}?`)) {
      const success = await deleteProfessional(professional.id);
      if (success) {
        refetch();
      }
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProfessional(null);
  };

  const handleProfessionalSaved = () => {
    refetch();
    handleCloseDialog();
  };

  if (isLoading) {
    return (
      <OnboardingRedirect>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando profissionais...</p>
          </div>
        </div>
      </OnboardingRedirect>
    );
  }

  return (
    <OnboardingRedirect>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profissionais</h1>
            <p className="text-gray-600">Gerencie sua equipe de profissionais</p>
          </div>
          <ProfessionalFormDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            professional={editingProfessional}
            onProfessionalSaved={handleProfessionalSaved}
            trigger={
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Novo Profissional
              </Button>
            }
          />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Profissionais</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{professionals.length}</div>
              <p className="text-xs text-muted-foreground">
                {professionals.filter(p => p.status === 'active').length} ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média de Avaliações</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">
                Avaliação média da equipe
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cargos</CardTitle>
              <Badge variant="secondary">
                {new Set(professionals.map(p => p.position).filter(Boolean)).size}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(professionals.map(p => p.position).filter(Boolean)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Cargos diferentes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar profissionais..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {filteredProfessionals.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {professionals.length === 0 ? 'Nenhum profissional cadastrado' : 'Nenhum profissional encontrado'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {professionals.length === 0 
                    ? 'Comece adicionando seu primeiro profissional à equipe.'
                    : 'Tente ajustar os termos de busca.'
                  }
                </p>
                {professionals.length === 0 && (
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Profissional
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProfessionals.map((professional) => (
                  <div key={professional.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {professional.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'P'}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{professional.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {professional.position && <span>{professional.position}</span>}
                          {professional.email && (
                            <>
                              <span>•</span>
                              <span>{professional.email}</span>
                            </>
                          )}
                        </div>
                        {professional.phone && (
                          <p className="text-sm text-gray-500">{professional.phone}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(professional.status || 'active')}>
                        {getStatusText(professional.status || 'active')}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(professional)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(professional)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </OnboardingRedirect>
  );
};

export default Professionals;
