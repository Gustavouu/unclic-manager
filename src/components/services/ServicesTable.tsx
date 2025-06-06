
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { ServiceFormDialog } from './ServiceFormDialog';
import { useServiceOperations } from '@/hooks/services/useServiceOperations';
import { toast } from 'sonner';
import type { Service } from '@/types/service';

interface ServicesTableProps {
  services: Service[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const ServicesTable: React.FC<ServicesTableProps> = ({
  services,
  isLoading,
  onRefresh
}) => {
  const { deleteService, toggleServiceStatus } = useServiceOperations();

  const handleDelete = async (service: Service) => {
    if (window.confirm(`Tem certeza que deseja excluir o serviço "${service.name || service.nome}"?`)) {
      const success = await deleteService(service.id);
      if (success) {
        onRefresh();
      }
    }
  };

  const handleToggleStatus = async (service: Service) => {
    const currentStatus = service.is_active ?? service.ativo ?? true;
    const result = await toggleServiceStatus(service.id, currentStatus);
    if (result) {
      onRefresh();
    }
  };

  const formatPrice = (price: number | undefined) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price || 0);
  };

  const formatDuration = (duration: number | undefined) => {
    const mins = duration || 0;
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    
    if (hours > 0) {
      return `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
    }
    return `${minutes}min`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhum serviço encontrado</p>
        <ServiceFormDialog onServiceSaved={onRefresh} />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Imagem</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Duração</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Comissão</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>
                {service.image_url ? (
                  <img
                    src={service.image_url}
                    alt={service.name || service.nome}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-400">Sem imagem</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{service.name || service.nome}</div>
                  {(service.description || service.descricao) && (
                    <div className="text-sm text-gray-500 truncate max-w-[200px]">
                      {service.description || service.descricao}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {service.category || service.categoria || 'Geral'}
                </Badge>
              </TableCell>
              <TableCell>{formatDuration(service.duration || service.duracao)}</TableCell>
              <TableCell>{formatPrice(service.price || service.preco)}</TableCell>
              <TableCell>
                {service.commission_percentage ? `${service.commission_percentage}%` : '-'}
              </TableCell>
              <TableCell>
                <Badge variant={service.is_active ?? service.ativo ? 'default' : 'secondary'}>
                  {service.is_active ?? service.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <ServiceFormDialog
                      service={service}
                      onServiceSaved={onRefresh}
                      trigger={
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                      }
                    />
                    <DropdownMenuItem onClick={() => handleToggleStatus(service)}>
                      {service.is_active ?? service.ativo ? (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Ativar
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(service)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
