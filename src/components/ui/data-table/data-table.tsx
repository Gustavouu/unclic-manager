
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search,
  ArrowUpDown,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AsyncState } from '../async-state';
import { LoadingState } from '@/hooks/use-loading-state';
import { Skeleton } from '@/components/ui/skeleton';

export interface Column<T> {
  header: string;
  accessorKey: string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  state?: LoadingState;
  emptyMessage?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  pagination?: {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    onPageChange: (page: number) => void;
  };
  sorting?: {
    field: string | null;
    direction: 'asc' | 'desc' | null;
    onSort: (field: string) => void;
  };
  actions?: React.ReactNode;
  className?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({
  data,
  columns,
  state = 'idle',
  emptyMessage = "Não há dados para exibir",
  showSearch = false,
  onSearch,
  searchPlaceholder = "Buscar...",
  pagination,
  sorting,
  actions,
  className,
  onRowClick
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSort = (field: string) => {
    if (sorting?.onSort && field) {
      sorting.onSort(field);
    }
  };

  const renderSortingIcon = (field: string) => {
    if (!sorting) return null;
    
    if (sorting.field !== field) {
      return <ArrowUpDown className="h-3 w-3 ml-1" />;
    }
    
    return sorting.direction === 'asc' 
      ? <ChevronUp className="h-3 w-3 ml-1" /> 
      : <ChevronDown className="h-3 w-3 ml-1" />;
  };

  const renderTableContent = () => {
    if (state === 'loading') {
      return (
        <TableBody>
          {Array(5).fill(0).map((_, index) => (
            <TableRow key={`skeleton-${index}`}>
              {columns.map((column, colIndex) => (
                <TableCell 
                  key={`skeleton-cell-${colIndex}`}
                  className={cn(
                    column.hideOnMobile && 'hidden sm:table-cell',
                    column.className
                  )}
                >
                  <Skeleton className="h-5 w-full max-w-[120px]" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      );
    }

    if (state === 'error') {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={columns.length} className="h-32 text-center">
              <AsyncState state="error" errorText="Erro ao carregar dados" />
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    if (data.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={columns.length} className="h-32 text-center">
              <p className="text-muted-foreground">{emptyMessage}</p>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    return (
      <TableBody>
        {data.map((item, rowIndex) => (
          <TableRow 
            key={`row-${rowIndex}`} 
            className={cn(onRowClick && "cursor-pointer hover:bg-muted/50")}
            onClick={() => onRowClick && onRowClick(item)}
          >
            {columns.map((column, colIndex) => (
              <TableCell 
                key={`cell-${rowIndex}-${colIndex}`}
                className={cn(
                  column.hideOnMobile && 'hidden sm:table-cell',
                  column.className
                )}
              >
                {column.cell ? column.cell(item) : (item as any)[column.accessorKey]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {(showSearch || actions) && (
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          {showSearch && (
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={searchPlaceholder}
                className="w-full pl-9"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          )}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead 
                    key={`header-${index}`}
                    className={cn(
                      column.sortable && sorting && "cursor-pointer",
                      column.hideOnMobile && "hidden sm:table-cell",
                      column.headerClassName
                    )}
                    onClick={() => column.sortable && sorting && handleSort(column.accessorKey)}
                  >
                    <div className="flex items-center whitespace-nowrap">
                      {column.header}
                      {column.sortable && sorting && renderSortingIcon(column.accessorKey)}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            {renderTableContent()}
          </Table>
        </div>
      </div>
      
      {pagination && pagination.pageCount > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {pagination.pageIndex + 1} de {pagination.pageCount}
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.pageIndex - 1)}
              disabled={pagination.pageIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.pageIndex + 1)}
              disabled={pagination.pageIndex === pagination.pageCount - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
