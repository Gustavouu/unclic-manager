
import { useState, useMemo, useEffect } from 'react';

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

export const usePagination = ({ 
  totalItems, 
  itemsPerPage, 
  initialPage = 1 
}: UsePaginationProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  // Calculate total pages - minimum 1 page even if no items
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  // Make sure current page is valid
  useEffect(() => {
    const safePage = Math.max(1, Math.min(currentPage, totalPages));
    if (safePage !== currentPage) {
      setCurrentPage(safePage);
    }
  }, [currentPage, totalPages]);
  
  // Calculate indices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Paging functions
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  
  return {
    currentPage,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    setCurrentPage,
  };
};
