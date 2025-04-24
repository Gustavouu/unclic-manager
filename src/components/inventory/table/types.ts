
import { Product } from '@/hooks/inventory/types';

export interface InventoryTableProps {
  products: Product[];
  isLoading?: boolean;
  filterType?: string; // Add this optional property
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export interface InventoryPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
  onPageChange: (pageNumber: number) => void;
}
