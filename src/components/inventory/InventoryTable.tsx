
import React from 'react';
import { Product } from '@/hooks/inventory/types';
import { useInventorySort } from './table/hooks/useInventorySort';
import { useInventoryPagination } from './table/hooks/useInventoryPagination';
import { InventoryTableView } from './table/InventoryTableView';
import { InventoryPagination } from './table/InventoryPagination';
import { InventoryTableProps } from './table/types';

export const InventoryTable = ({ 
  products, 
  isLoading, 
  filterType,
  onEdit, 
  onDelete 
}: InventoryTableProps) => {
  // Filter products based on filterType if provided
  const filteredProducts = filterType ? filterByType(products, filterType) : products;
  
  const { sortField, sortDirection, sortedProducts, handleSort } = useInventorySort(filteredProducts);
  
  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,
    paginatedProducts,
    indexOfFirstItem,
    indexOfLastItem
  } = useInventoryPagination(sortedProducts);

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
};

// Helper function to filter products based on type
const filterByType = (products: Product[], filterType: string): Product[] => {
  switch (filterType) {
    case 'low':
      return products.filter(product => product.quantity <= product.minQuantity);
    case 'out':
      return products.filter(product => product.quantity === 0);
    case 'all':
    default:
      return products;
  }
};
