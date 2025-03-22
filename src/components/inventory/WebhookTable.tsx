
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ChevronUp, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data para webhooks
const webhooksData = [
  { 
    id: '1',
    date: '00/00/0000 às 00h00',
    product: 'Link de pagamento',
    url: 'https://meu-negocio-com.br/carrinho',
    authentication: 'Avançada'
  },
  { 
    id: '2',
    date: '00/00/0000 às 00h00',
    product: 'Link de pagamento',
    url: 'https://meu-negocio-com.br/carrinho',
    authentication: 'Básica'
  },
  { 
    id: '3',
    date: '00/00/0000 às 00h00',
    product: 'Link de pagamento',
    url: 'https://meu-negocio-com.br/carrinho',
    authentication: 'Básica'
  },
  { 
    id: '4',
    date: '00/00/0000 às 00h00',
    product: 'Pix',
    url: 'https://meu-negocio-com.br/carrinho',
    authentication: 'Avançada'
  },
  { 
    id: '5',
    date: '00/00/0000 às 00h00',
    product: 'Pix',
    url: 'https://meu-negocio-com.br/carrinho',
    authentication: 'Básica'
  },
  { 
    id: '6',
    date: '00/00/0000 às 00h00',
    product: 'Pix',
    url: 'https://meu-negocio-com.br/carrinho',
    authentication: 'Básica'
  },
  { 
    id: '7',
    date: '00/00/0000 às 00h00',
    product: 'Pix',
    url: 'https://meu-negocio-com.br/carrinho',
    authentication: 'Avançada'
  },
  { 
    id: '8',
    date: '00/00/0000 às 00h00',
    product: 'Pix',
    url: 'https://meu-negocio-com.br/carrinho',
    authentication: 'Avançada'
  },
  { 
    id: '9',
    date: '00/00/0000 às 00h00',
    product: 'Pix',
    url: 'https://meu-negocio-com.br/carrinho',
    authentication: 'Básica'
  },
  { 
    id: '10',
    date: '00/00/0000 às 00h00',
    product: 'Pix',
    url: 'https://meu-negocio-com.br/carrinho',
    authentication: 'Básica'
  },
];

export const WebhookTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<'date' | 'product' | null>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Função para ordenar os webhooks
  const sortedWebhooks = [...webhooksData].sort((a, b) => {
    if (!sortField) return 0;
    
    if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? a.date.localeCompare(b.date) 
        : b.date.localeCompare(a.date);
    }
    
    if (sortField === 'product') {
      return sortDirection === 'asc' 
        ? a.product.localeCompare(b.product) 
        : b.product.localeCompare(a.product);
    }
    
    return 0;
  });

  // Paginação
  const totalPages = Math.ceil(sortedWebhooks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedWebhooks.slice(indexOfFirstItem, indexOfLastItem);
  
  const handleSort = (field: 'date' | 'product') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-md shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead 
                className="cursor-pointer font-medium text-sm" 
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center">
                  Data / Hora alteração {sortField === 'date' ? (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                  ) : null}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer font-medium text-sm"
                onClick={() => handleSort('product')}
              >
                <div className="flex items-center">
                  Produto {sortField === 'product' ? (
                    sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                  ) : null}
                </div>
              </TableHead>
              <TableHead className="font-medium text-sm">URL</TableHead>
              <TableHead className="font-medium text-sm">Autenticação</TableHead>
              <TableHead className="text-right font-medium text-sm">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((webhook) => (
              <TableRow key={webhook.id} className="text-sm">
                <TableCell>{webhook.date}</TableCell>
                <TableCell>{webhook.product}</TableCell>
                <TableCell className="max-w-[200px] truncate">{webhook.url}</TableCell>
                <TableCell>{webhook.authentication}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Ações</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-muted-foreground">
          Exibindo {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, webhooksData.length)} de {webhooksData.length} registros
        </div>
        
        <div className="flex items-center space-x-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      isActive={currentPage === pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              {totalPages > 5 && (
                <PaginationItem>
                  <span className="flex h-9 w-9 items-center justify-center">...</span>
                </PaginationItem>
              )}
              
              {totalPages > 5 && (
                <PaginationItem>
                  <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-2">Itens por página</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-16">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
