
import React, { useState } from 'react';
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
import { DeleteServiceDialog } from './DeleteServiceDialog';
import { useServiceOperations } from '@/hooks/services/useServiceOperations';
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
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const { toggleServiceStatus, isSubmitting } = useServiceOperations();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  const handleToggleStatus = async (service: Service) => {
    const currentStatus = service.is_active ?? service.ativo ?? true;
    const result = await toggleServiceStatus(service.id, currentStatus);
    if (result) {
      onRefresh();
    }
  };

  const handleServiceUpdated = () => {
    setEditingService(null);
    onRefresh();
  };

  const handleServiceDeleted = () => {
    setDeletingService(null);
    onRefresh();
  };

  if (isLoading) {
    return (
      <div className="w-full p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Carregando serviços...</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-muted-foreground">Nenhum serviço encontrado</p>
        <p className="text-sm text-muted-foreground mt-1">
          Crie seu primeiro serviço para começar
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => {
              const isActive = service.is_active ?? service.ativo ?? true;
              const name = service.name || service.nome || '';
              const description = service.description || service.descricao || '';
              const duration = service.duration || service.duracao || 0;
              const price = service.price || service.preco || 0;
              const category = service.category || service.categoria || 'Geral';

              return (
                <TableRow key={service.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{name}</div>
                      {description && (
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{category}</Badge>
                  </TableCell>
                  <TableCell>{formatDuration(duration)}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(price)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={isActive ? "default" : "secondary"}>
                      {isActive ? 'Ativo' : 'Inativo'}
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
                        <DropdownMenuItem
                          onClick={() => setEditingService(service)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(service)}
                          disabled={isSubmitting}
                        >
                          {isActive ? (
                            <EyeOff className="mr-2 h-4 w-4" />
                          ) : (
                            <Eye className="mr-2 h-4 w-4" />
                          )}
                          {isActive ? 'Desativar' : 'Ativar'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingService(service)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <ServiceFormDialog
        open={!!editingService}
        onOpenChange={(open) => !open && setEditingService(null)}
        service={editingService}
        onServiceSaved={handleServiceUpdated}
      />

      <DeleteServiceDialog
        open={!!deletingService}
        onOpenChange={(open) => !open && setDeletingService(null)}
        service={deletingService}
        onServiceDeleted={handleServiceDeleted}
      />
    </>
  );
};
