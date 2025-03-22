
import { Product } from '@/hooks/inventory/types';

export type SortField = 'name' | 'category' | 'price' | 'quantity' | null;
export type SortDirection = 'asc' | 'desc';

export interface InventoryTableProps {
  products: Product[];
  isLoading: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}
