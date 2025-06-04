
import { useState, useEffect, useMemo } from 'react';
import { useClientsData } from './useClientsData';
import type { Client } from '@/types/client';

export const useClientSearch = () => {
  const { clients } = useClientsData();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Advanced search with multiple criteria
  const searchClients = useMemo(() => {
    if (!searchTerm.trim()) {
      return clients;
    }

    const term = searchTerm.toLowerCase();
    return clients.filter(client => {
      // Search in multiple fields
      const searchableFields = [
        client.name,
        client.email,
        client.phone,
        client.city,
        client.state,
        client.notes,
      ].filter(Boolean).join(' ').toLowerCase();

      return searchableFields.includes(term);
    });
  }, [clients, searchTerm]);

  useEffect(() => {
    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      setSearchResults(searchClients);
      setIsSearching(false);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchClients]);

  const quickSearchByName = (name: string): Client | undefined => {
    return clients.find(client => 
      client.name.toLowerCase().includes(name.toLowerCase())
    );
  };

  const searchByEmail = (email: string): Client | undefined => {
    return clients.find(client => 
      client.email?.toLowerCase() === email.toLowerCase()
    );
  };

  const searchByPhone = (phone: string): Client | undefined => {
    return clients.find(client => 
      client.phone?.replace(/\D/g, '') === phone.replace(/\D/g, '')
    );
  };

  const getRecentClients = (limit: number = 5): Client[] => {
    return [...clients]
      .sort((a, b) => {
        const dateA = new Date(a.last_visit || a.created_at);
        const dateB = new Date(b.last_visit || b.created_at);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit);
  };

  const getTopSpendingClients = (limit: number = 5): Client[] => {
    return [...clients]
      .sort((a, b) => (b.total_spent || 0) - (a.total_spent || 0))
      .slice(0, limit);
  };

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    quickSearchByName,
    searchByEmail,
    searchByPhone,
    getRecentClients,
    getTopSpendingClients,
  };
};
