import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Filter, MoreHorizontal, Phone, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Client } from "@/hooks/useClients";
import { useState } from "react";
import { ClientDetails } from "./ClientDetails";

interface ClientsTableProps {
  clients: Client[];
  isLoading: boolean;
  showFiltersButton?: boolean;
  onToggleFilters?: () => void;
}

export function ClientsTable({
  clients,
  isLoading,
  showFiltersButton = false,
  onToggleFilters,
}: ClientsTableProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Nunca";
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
  };

  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="text-sm font-semibold">Lista de Clientes</h3>
        {showFiltersButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFilters}
            className="lg:hidden"
          >
            <Filter size={16} className="mr-2" />
            Filtros
          </Button>
        )}
      </div>
      
      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden md:table-cell">Contato</TableHead>
              <TableHead className="hidden md:table-cell">Última Visita</TableHead>
              <TableHead className="hidden lg:table-cell">Total Gasto</TableHead>
              <TableHead className="hidden lg:table-cell">Cidade</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center">
                        <Skeleton className="h-8 w-8 rounded-full mr-2" />
                        <Skeleton className="h-4 w-[120px]" />
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-[150px]" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </TableCell>
                  </TableRow>
                ))
            ) : clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 text-xs font-medium uppercase">
                        {client.nome.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{client.nome}</span>
                        <span className="text-xs text-muted-foreground md:hidden">
                          {client.email || client.telefone || "Sem contato"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col">
                      {client.email && (
                        <div className="flex items-center">
                          <Mail size={14} className="mr-1 text-muted-foreground" />
                          <span className="text-sm">{client.email}</span>
                        </div>
                      )}
                      {client.telefone && (
                        <div className="flex items-center">
                          <Phone size={14} className="mr-1 text-muted-foreground" />
                          <span className="text-sm">{client.telefone}</span>
                        </div>
                      )}
                      {!client.email && !client.telefone && (
                        <span className="text-sm text-muted-foreground">Sem contato</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm">{formatDate(client.ultima_visita)}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-sm">{formatCurrency(client.valor_total_gasto || 0)}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-sm">{client.cidade || "-"}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewClient(client)}
                      >
                        <Eye size={16} />
                        <span className="sr-only">Ver cliente</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal size={16} />
                            <span className="sr-only">Opções</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewClient(client)}>
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Agendar</DropdownMenuItem>
                          <DropdownMenuItem>Enviar mensagem</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {selectedClient && (
        <ClientDetails
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </div>
  );
}
