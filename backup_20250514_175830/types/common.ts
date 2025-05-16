
// Common types used across the application

// Filter type for date ranges
export interface DateFilter {
  from: Date;
  to: Date;
}

// Standardized pagination state
export interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Common response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// Common sort direction
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: string;
  direction: SortDirection;
}

// Common filter state
export interface FilterState {
  search?: string;
  dateRange?: DateFilter;
  status?: string[];
  categories?: string[];
  [key: string]: any;
}
