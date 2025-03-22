
import { useState, useMemo } from 'react';
import { Product } from '@/hooks/inventory/types';

export const useInventoryPagination = (products: Product[]) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = useMemo(() => {
    return Math.ceil(products.length / itemsPerPage);
  }, [products.length]);

  const paginatedProducts = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return products.slice(indexOfFirstItem, indexOfLastItem);
  }, [products, currentPage, itemsPerPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,
    paginatedProducts,
    indexOfFirstItem,
    indexOfLastItem
  };
};
