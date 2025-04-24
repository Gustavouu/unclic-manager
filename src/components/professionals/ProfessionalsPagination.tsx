
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink,
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";

interface ProfessionalsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number; // Make this optional
  itemsPerPage?: number; // Add this optional prop
  onPageChange: (page: number) => void;
}

export const ProfessionalsPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: ProfessionalsPaginationProps) => {
  if (totalPages <= 1) return null;
  
  // Generate page numbers to display
  const generatePaginationItems = () => {
    let items = [];
    
    // Define how many page numbers to show
    const maxPagesDisplayed = 5;
    const sidePages = Math.floor(maxPagesDisplayed / 2);
    
    let startPage = Math.max(1, currentPage - sidePages);
    let endPage = Math.min(totalPages, startPage + maxPagesDisplayed - 1);
    
    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxPagesDisplayed) {
      startPage = Math.max(1, endPage - maxPagesDisplayed + 1);
    }
    
    // First page and ellipsis if needed
    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => onPageChange(1)} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      if (startPage > 2) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }
    
    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => onPageChange(i)} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => onPageChange(totalPages)} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };
  
  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))} 
            className={currentPage === 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
        
        {generatePaginationItems()}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            className={currentPage === totalPages ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
