
import { useState, useMemo } from 'react';
import { Webhook, SortField, SortDirection } from '../types';

export const useWebhookSort = (webhooks: Webhook[]) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedWebhooks = useMemo(() => {
    if (!sortField) return [...webhooks];
    
    return [...webhooks].sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc' 
          ? a.date.localeCompare(b.date) 
          : b.date.localeCompare(a.date);
      }
      
      if (sortField === 'product') {
        return sortDirection === 'asc' 
          ? a.product.localeCompare(b.product) 
          : b.product.localeCompare(a.product);
      }
      
      return 0;
    });
  }, [webhooks, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    sortField,
    sortDirection,
    sortedWebhooks,
    handleSort
  };
};
