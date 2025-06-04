
import { useState, useMemo } from 'react';
import { Product } from './types';

export interface InventoryFilters {
  search: string;
  category: string;
  status: 'all' | 'low' | 'out' | 'normal';
  sortBy: 'name' | 'category' | 'price' | 'quantity';
  sortOrder: 'asc' | 'desc';
}

export const useInventoryFilters = (products: Product[]) => {
  const [filters, setFilters] = useState<InventoryFilters>({
    search: '',
    category: 'all',
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.supplier?.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(product => {
        switch (filters.status) {
          case 'low':
            return product.quantity <= product.minQuantity;
          case 'out':
            return product.quantity === 0;
          case 'normal':
            return product.quantity > product.minQuantity;
          default:
            return true;
        }
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (filters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'quantity':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [products, filters]);

  const updateFilter = (key: keyof InventoryFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      status: 'all',
      sortBy: 'name',
      sortOrder: 'asc',
    });
  };

  return {
    filters,
    filteredProducts,
    updateFilter,
    clearFilters,
  };
};
