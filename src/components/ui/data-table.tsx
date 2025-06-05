
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Loading } from './loading';
import { EmptyState } from './empty-state';

export interface Column<T> {
  key: keyof T | 'actions';
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
  };
  emptyState?: {
    title: string;
    description?: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  className?: string;
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
  sortState?: {
    key: keyof T;
    direction: 'asc' | 'desc';
  };
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  pagination,
  emptyState,
  className,
  onSort,
  sortState
}: DataTableProps<T>) {
  const handleSort = (key: keyof T) => {
    if (!onSort) return;
    
    const newDirection = 
      sortState?.key === key && sortState.direction === 'asc' ? 'desc' : 'asc';
    onSort(key, newDirection);
  };

  if (isLoading) {
    return (
      <div className={cn('border rounded-lg', className)}>
        <Loading size="lg" text="Carregando dados..." className="py-12" />
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return (
      <div className={cn('border rounded-lg', className)}>
        <EmptyState {...emptyState} />
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={cn(
                      'px-4 py-3 text-left text-sm font-medium text-muted-foreground',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      column.sortable && 'cursor-pointer hover:text-foreground',
                      column.width && `w-${column.width}`
                    )}
                    onClick={() => column.sortable && handleSort(column.key as keyof T)}
                  >
                    <div className="flex items-center gap-2">
                      {column.header}
                      {column.sortable && sortState?.key === column.key && (
                        <span className="text-xs">
                          {sortState.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-muted/25 transition-colors">
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={cn(
                        'px-4 py-3 text-sm',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                    >
                      {column.render 
                        ? column.render(item[column.key], item)
                        : String(item[column.key] || '-')
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Mostrando {((pagination.currentPage - 1) * pagination.pageSize) + 1} a{' '}
            {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} de{' '}
            {pagination.totalItems} resultados
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-4">
              Página {pagination.currentPage} de {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
