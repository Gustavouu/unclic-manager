
import { useState, useMemo } from 'react';
import { useClientsData } from './useClientsData';
import type { Client } from '@/types/client';

export interface ClientFilters {
  search: string;
  status: string;
  city: string;
  gender: string;
  dateRange: string;
  spendingRange: string;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}

export const useClientsList = () => {
  const { clients, isLoading, error, refetch } = useClientsData();
  const [filters, setFilters] = useState<ClientFilters>({
    search: '',
    status: '',
    city: '',
    gender: '',
    dateRange: '',
    spendingRange: '',
  });
  const [pagination, setPagination] = useState<PaginationConfig>({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  // Filter clients based on current filters
  const filteredClients = useMemo(() => {
    let filtered = [...clients];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm) ||
        client.email?.toLowerCase().includes(searchTerm) ||
        client.phone?.includes(filters.search)
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(client => client.status === filters.status);
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(client => client.city === filters.city);
    }

    // Gender filter
    if (filters.gender) {
      filtered = filtered.filter(client => client.gender === filters.gender);
    }

    // Date range filter
    if (filters.dateRange) {
      const now = new Date();
      let cutoffDate: Date;

      switch (filters.dateRange) {
        case 'last_week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'last_month':
          cutoffDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          break;
        case 'last_3_months':
          cutoffDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
          break;
        case 'last_6_months':
          cutoffDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
          break;
        case 'over_6_months':
          cutoffDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
          filtered = filtered.filter(client => {
            const lastVisit = client.last_visit ? new Date(client.last_visit) : null;
            return !lastVisit || lastVisit < cutoffDate;
          });
          break;
        default:
          break;
      }

      if (filters.dateRange !== 'over_6_months' && cutoffDate!) {
        filtered = filtered.filter(client => {
          const lastVisit = client.last_visit ? new Date(client.last_visit) : null;
          return lastVisit && lastVisit >= cutoffDate;
        });
      }
    }

    // Spending range filter
    if (filters.spendingRange) {
      switch (filters.spendingRange) {
        case 'low':
          filtered = filtered.filter(client => (client.total_spent || 0) < 100);
          break;
        case 'medium':
          filtered = filtered.filter(client => {
            const spent = client.total_spent || 0;
            return spent >= 100 && spent < 500;
          });
          break;
        case 'high':
          filtered = filtered.filter(client => (client.total_spent || 0) >= 500);
          break;
      }
    }

    return filtered;
  }, [clients, filters]);

  // Paginated clients
  const paginatedClients = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginated = filteredClients.slice(startIndex, endIndex);
    
    // Update total count
    setPagination(prev => ({ ...prev, total: filteredClients.length }));
    
    return paginated;
  }, [filteredClients, pagination.page, pagination.pageSize]);

  // Get unique cities for filter options
  const availableFilters = useMemo(() => {
    const cities = Array.from(new Set(clients.map(client => client.city).filter(Boolean)));
    const genders = Array.from(new Set(clients.map(client => client.gender).filter(Boolean)));
    
    return { cities, genders };
  }, [clients]);

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      city: '',
      gender: '',
      dateRange: '',
      spendingRange: '',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const updateFilters = (newFilters: Partial<ClientFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filtering
  };

  const updatePagination = (newPagination: Partial<PaginationConfig>) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  };

  return {
    clients: paginatedClients,
    allClients: filteredClients,
    filters,
    pagination,
    availableFilters,
    isLoading,
    error,
    refetch,
    updateFilters,
    updatePagination,
    clearFilters,
  };
};
