
import { useState, useEffect } from 'react';
import { useClients } from '@/hooks/useClients';

export const useClientsList = () => {
  const { clients, isLoading, error, searchClients } = useClients();
  const [filteredClients, setFilteredClients] = useState(clients);

  useEffect(() => {
    setFilteredClients(clients);
  }, [clients]);

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredClients(clients);
      return;
    }

    try {
      const results = await searchClients(searchTerm);
      setFilteredClients(results);
    } catch (error) {
      console.error('Error searching clients:', error);
      setFilteredClients([]);
    }
  };

  return {
    clients: filteredClients,
    isLoading,
    error,
    searchClients: handleSearch,
  };
};
