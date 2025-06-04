
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Users, Star } from 'lucide-react';
import { OnboardingRedirect } from '@/components/auth/OnboardingRedirect';

interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  specialties: string[];
  status: 'active' | 'inactive';
  photo_url?: string;
  commission_percentage: number;
  hire_date: string;
}

const Professionals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [professionals, setProfessionals] = useState<Professional[]>([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@exemplo.com',
      phone: '(11) 99999-9999',
      position: 'Barbeiro Senior',
      specialties: ['Corte Masculino', 'Barba', 'Bigode'],
      status: 'active',
      commission_percentage: 40,
      hire_date: '2023-01-15'
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@exemplo.com',
      phone: '(11) 88888-8888',
      position: 'Cabeleireira',
      specialties: ['Corte Feminino', 'Coloração', 'Escova'],
      status: 'active',
      commission_percentage: 45,
      hire_date: '2023-03-20'
    }
  ]);

  const filteredProfessionals = professionals.filter(professional =>
    professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professional.position.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <OnboardingRedirect>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profissionais</h1>
            <p className="text-gray-600">Gerencie sua equipe de profissionais</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Profissional
          </Button>
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
              <CardTitle className="text-sm font-medium">Comissão Média</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(professionals.reduce((sum, p) => sum + p.commission_percentage, 0) / professionals.length)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Comissão média da equipe
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Especialidades</CardTitle>
              <Badge variant="secondary">
                {new Set(professionals.flatMap(p => p.specialties)).size}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(professionals.flatMap(p => p.specialties)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Especialidades diferentes
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
            <div className="space-y-4">
              {filteredProfessionals.map((professional) => (
                <div key={professional.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {professional.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{professional.name}</h3>
                      <p className="text-sm text-gray-600">{professional.position}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {professional.specialties.slice(0, 3).map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {professional.specialties.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{professional.specialties.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{professional.commission_percentage}%</p>
                      <p className="text-xs text-gray-500">Comissão</p>
                    </div>
                    <Badge className={getStatusColor(professional.status)}>
                      {getStatusText(professional.status)}
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredProfessionals.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum profissional encontrado</p>
                  {searchTerm && (
                    <p className="text-sm">Tente buscar com outros termos</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </OnboardingRedirect>
  );
};

export default Professionals;
