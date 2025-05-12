
import React, { memo, useMemo } from 'react';
import { Product } from '@/hooks/inventory/types';
import { useInventorySort } from './hooks/useInventorySort';
import { InventoryTableView } from './InventoryTableView';
import { InventoryPagination } from './InventoryPagination';

// Memoized table props interface
export interface OptimizedInventoryTableProps {
  products: Product[];
  isLoading: boolean;
  filterType?: string;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  itemsPerPage?: number;
}

// Memoized inventory table component
export const OptimizedInventoryTable = memo(({ 
  products, 
  isLoading, 
  filterType,
  onEdit, 
  onDelete,
  itemsPerPage = 10
}: OptimizedInventoryTableProps) => {
  // Filter products based on filterType if provided
  const filteredProducts = useMemo(() => {
    if (!filterType) return products;
    
    switch (filterType) {
      case 'low':
        return products.filter(product => product.quantity <= product.minQuantity);
      case 'out':
        return products.filter(product => product.quantity === 0);
      case 'all':
      default:
        return products;
    }
  }, [products, filterType]);
  
  const { sortField, sortDirection, sortedProducts, handleSort } = useInventorySort(filteredProducts);
  
  const [currentPage, setCurrentPage] = React.useState(1);
  
  // Calculate pagination details with memoization
  const {
    paginatedProducts,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem
  } = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedProducts = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    
    return {
      paginatedProducts,
      totalPages,
      indexOfFirstItem,
      indexOfLastItem: Math.min(indexOfLastItem, sortedProducts.length),
    };
  }, [sortedProducts, currentPage, itemsPerPage]);

  return (
    <div className="space-y-4">
      <InventoryTableView 
        products={paginatedProducts}
        isLoading={isLoading}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      {!isLoading && totalPages > 0 && (
        <InventoryPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredProducts.length}
          indexOfFirstItem={indexOfFirstItem}
          indexOfLastItem={indexOfLastItem}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
});

OptimizedInventoryTable.displayName = 'OptimizedInventoryTable';
