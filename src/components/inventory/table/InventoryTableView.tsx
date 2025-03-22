
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { Product } from '@/hooks/inventory/types';
import { InventoryActions } from './InventoryActions';
import { StockStatus } from './StockStatus';
import { SortField, SortDirection } from './types';

interface InventoryTableViewProps {
  products: Product[];
  isLoading: boolean;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export const InventoryTableView = ({ 
  products, 
  isLoading, 
  sortField, 
  sortDirection, 
  onSort,
  onEdit,
  onDelete
}: InventoryTableViewProps) => {
  
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1" />;
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-3 w-3 ml-1" /> 
      : <ChevronDown className="h-3 w-3 ml-1" />;
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="cursor-pointer whitespace-nowrap text-xs py-2" onClick={() => onSort('name')}>
                <div className="flex items-center">
                  Produto {getSortIcon('name')}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer whitespace-nowrap text-xs py-2" onClick={() => onSort('category')}>
                <div className="flex items-center">
                  Categoria {getSortIcon('category')}
                </div>
              </TableHead>
              <TableHead className="text-right cursor-pointer whitespace-nowrap text-xs py-2" onClick={() => onSort('price')}>
                <div className="flex items-center justify-end">
                  Preço {getSortIcon('price')}
                </div>
              </TableHead>
              <TableHead className="text-right cursor-pointer whitespace-nowrap text-xs py-2" onClick={() => onSort('quantity')}>
                <div className="flex items-center justify-end">
                  Qtd {getSortIcon('quantity')}
                </div>
              </TableHead>
              <TableHead className="whitespace-nowrap text-xs py-2">Status</TableHead>
              <TableHead className="text-right whitespace-nowrap text-xs py-2">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="py-1.5"><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell className="py-1.5"><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="py-1.5"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                  <TableCell className="py-1.5"><Skeleton className="h-4 w-8 ml-auto" /></TableCell>
                  <TableCell className="py-1.5"><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="py-1.5"><Skeleton className="h-6 w-6 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-xs text-muted-foreground">
                  Nenhum produto cadastrado. Adicione seu primeiro produto!
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="text-xs">
                  <TableCell className="font-medium py-1.5">{product.name}</TableCell>
                  <TableCell className="py-1.5">{product.category}</TableCell>
                  <TableCell className="text-right py-1.5">R$ {product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right py-1.5">{product.quantity}</TableCell>
                  <TableCell className="py-1.5"><StockStatus product={product} /></TableCell>
                  <TableCell className="text-right py-1.5">
                    <InventoryActions 
                      product={product} 
                      onEdit={onEdit} 
                      onDelete={onDelete} 
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
