
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface InventoryPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
  onPageChange: (page: number) => void;
}

export const InventoryPagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  indexOfFirstItem,
  indexOfLastItem,
  onPageChange
}: InventoryPaginationProps) => {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Exibindo {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)} de {totalItems} registros
      </p>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
            const pageNumber = currentPage <= 3
              ? index + 1
              : currentPage >= totalPages - 2
                ? totalPages - 4 + index
                : currentPage - 2 + index;
            
            if (pageNumber <= 0 || pageNumber > totalPages) return null;
            
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  isActive={currentPage === pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <PaginationItem>
                <PaginationLink className="cursor-default">...</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
