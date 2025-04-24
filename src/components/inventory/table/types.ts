
import { Product } from '@/hooks/inventory/types';

export type SortField = 'name' | 'quantity' | 'price' | 'category';
export type SortDirection = 'asc' | 'desc';

export interface InventoryTableProps {
  products: Product[];
  isLoading?: boolean;
  filterType?: string;
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
