
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useClients } from '@/hooks/clients/useClients';
import { Loading } from '@/components/ui/loading';
import { toast } from 'sonner';
import type { Client } from '@/types/client';

interface ClientsListStandardizedProps {
  onCreateClient?: () => void;
  onEditClient?: (client: Client) => void;
  onViewClient?: (client: Client) => void;
}

export const ClientsListStandardized: React.FC<ClientsListStandardizedProps> = ({
  onCreateClient,
  onEditClient,
  onViewClient,
}) => {
  const { clients, stats, isLoading, error, searchClients, deleteClient } = useClients();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async () => {
    const searchParams: any = {};
    
    if (searchTerm.trim()) {
      searchParams.search = searchTerm.trim();
    }
    
    if (statusFilter !== 'all') {
      searchParams.status = statusFilter;
    }

    await searchClients(searchParams);
  };

  const handleDelete = async (clientId: string, clientName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o cliente "${clientName}"?`)) return;
    
    try {
      await deleteClient(clientId);
      toast.success('Cliente excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Erro ao excluir cliente');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Ativo', color: 'bg-green-100 text-green-800' };
      case 'inactive':
        return { label: 'Inativo', color: 'bg-gray-100 text-gray-800' };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (isLoading) {
    return <Loading size="lg" className="h-64" />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-2">Erro ao carregar clientes</div>
            <p className="text-gray-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} ativos, {stats.inactive} inativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Novos este Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.new_this_month}</div>
            <p className="text-xs text-muted-foreground">Novos clientes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.total_spent)}
            </div>
            <p className="text-xs text-muted-foreground">
              Média: {formatCurrency(stats.average_spent)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ativos (30 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.last_30_days}</div>
            <p className="text-xs text-muted-foreground">Com visitas recentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Cabeçalho com filtros */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Clientes</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              {onCreateClient && (
                <Button onClick={onCreateClient}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              )}
            </div>
          </div>

          {/* Filtros */}
          <div className={`space-y-4 ${showFilters ? 'block' : 'hidden'}`}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por nome, email ou telefone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Lista de Clientes */}
      {clients.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum cliente encontrado
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Comece adicionando seu primeiro cliente.'
                }
              </p>
              {onCreateClient && !searchTerm && statusFilter === 'all' && (
                <Button onClick={onCreateClient}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Cliente
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {clients.map((client) => {
            const statusInfo = getStatusConfig(client.status);
            return (
              <Card key={client.id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{client.name}</h3>
                            <Badge className={statusInfo.color}>
                              {statusInfo.label}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {onViewClient && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onViewClient(client)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {onEditClient && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEditClient(client)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(client.id, client.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        {client.email && (
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span>{client.email}</span>
                          </div>
                        )}
                        
                        {client.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span>{client.phone}</span>
                          </div>
                        )}

                        {client.birth_date && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>
                              {format(new Date(client.birth_date), "dd 'de' MMMM", { locale: ptBR })}
                            </span>
                          </div>
                        )}

                        {(client.city || client.state) && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>
                              {[client.city, client.state].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}

                        {client.total_spent > 0 && (
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Total gasto:</span>
                            <span className="text-green-600 font-medium">
                              {formatCurrency(client.total_spent)}
                            </span>
                          </div>
                        )}

                        {client.last_visit && (
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Última visita:</span>
                            <span>
                              {format(new Date(client.last_visit), "dd/MM/yyyy", { locale: ptBR })}
                            </span>
                          </div>
                        )}
                      </div>

                      {client.notes && (
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-700">{client.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
