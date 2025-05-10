
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, Eye } from "lucide-react";
import { ServiceData } from "./servicesData";
import { Skeleton } from "@/components/ui/skeleton";

interface ServicesTableProps {
  services: ServiceData[];
  onServiceUpdated?: (service: ServiceData) => void;
  onServiceDeleted?: (id: string) => void;
  readonly?: boolean;
}

export function ServicesTable({ 
  services, 
  onServiceUpdated, 
  onServiceDeleted,
  readonly = false
}: ServicesTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} min`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}min`;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Render loading state
  if (!services) {
    return (
      <div>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4 py-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[160px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Duração</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Status</TableHead>
            {!readonly && <TableHead className="text-right">Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.length === 0 ? (
            <TableRow>
              <TableCell colSpan={readonly ? 4 : 5} className="text-center py-10 text-muted-foreground">
                Nenhum serviço encontrado
              </TableCell>
            </TableRow>
          ) : (
            services.map((service) => (
              <>
                <TableRow 
                  key={service.id} 
                  className={expandedRow === service.id ? "bg-muted/50" : "hover:bg-muted/50"}
                  onClick={() => setExpandedRow(expandedRow === service.id ? null : service.id)}
                >
                  <TableCell className="font-medium">
                    {service.name}
                    {service.isPopular && (
                      <Badge variant="secondary" className="ml-2">Popular</Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDuration(service.duration)}</TableCell>
                  <TableCell>{formatPrice(service.price)}</TableCell>
                  <TableCell>
                    <Badge variant={service.isActive !== false ? "default" : "outline"}>
                      {service.isActive !== false ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  {!readonly && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            console.log("Visualizar detalhes", service.id);
                          }}>
                            <Eye className="mr-2 h-4 w-4" /> Visualizar detalhes
                          </DropdownMenuItem>
                          {onServiceUpdated && (
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              // Simulação de edição
                              onServiceUpdated({...service, name: `${service.name} (Editado)`});
                            }}>
                              <Pencil className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                          )}
                          {onServiceDeleted && (
                            <DropdownMenuItem 
                              className="text-red-600" 
                              onClick={(e) => {
                                e.stopPropagation();
                                onServiceDeleted(service.id);
                              }}
                            >
                              <Trash className="mr-2 h-4 w-4" /> Excluir
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
                {expandedRow === service.id && (
                  <TableRow>
                    <TableCell colSpan={readonly ? 4 : 5} className="bg-muted/30 p-4">
                      <div className="space-y-2">
                        {service.description && (
                          <div>
                            <h4 className="text-sm font-medium">Descrição</h4>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium">Detalhes</h4>
                            <ul className="text-sm text-muted-foreground">
                              {service.isFeatured && <li>Serviço em destaque</li>}
                              {service.isPopular && <li>Serviço popular</li>}
                              <li>Duração: {formatDuration(service.duration)}</li>
                              <li>Preço: {formatPrice(service.price)}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
