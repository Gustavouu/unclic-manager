
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
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-4 w-4 ml-1" /> 
      : <ChevronDown className="h-4 w-4 ml-1" />;
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="cursor-pointer" onClick={() => onSort('name')}>
              <div className="flex items-center">
                Produto {getSortIcon('name')}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort('category')}>
              <div className="flex items-center">
                Categoria {getSortIcon('category')}
              </div>
            </TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => onSort('price')}>
              <div className="flex items-center justify-end">
                Preço {getSortIcon('price')}
              </div>
            </TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => onSort('quantity')}>
              <div className="flex items-center justify-end">
                Quantidade {getSortIcon('quantity')}
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                <TableCell><Skeleton className="h-5 w-12 ml-auto" /></TableCell>
                <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Nenhum produto cadastrado. Adicione seu primeiro produto!
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-right">R$ {product.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">{product.quantity}</TableCell>
                <TableCell><StockStatus product={product} /></TableCell>
                <TableCell className="text-right">
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
  );
};
