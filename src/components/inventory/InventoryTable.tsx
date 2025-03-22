
import React from 'react';
import { Product } from '@/hooks/inventory/types';
import { useInventorySort } from './table/hooks/useInventorySort';
import { useInventoryPagination } from './table/hooks/useInventoryPagination';
import { InventoryTableView } from './table/InventoryTableView';
import { InventoryPagination } from './table/InventoryPagination';
import { InventoryTableProps } from './table/types';

export const InventoryTable = ({ products, isLoading, onEdit, onDelete }: InventoryTableProps) => {
  const { sortField, sortDirection, sortedProducts, handleSort } = useInventorySort(products);
  
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
          totalItems={products.length}
          indexOfFirstItem={indexOfFirstItem}
          indexOfLastItem={indexOfLastItem}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};
