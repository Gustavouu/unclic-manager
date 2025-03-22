
import { useState, useMemo } from 'react';

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
  
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Make sure current page is valid
  const safePage = Math.max(1, Math.min(currentPage, totalPages || 1));
  
  // If safePage is different from currentPage, update it
  if (safePage !== currentPage) {
    setCurrentPage(safePage);
  }
  
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
