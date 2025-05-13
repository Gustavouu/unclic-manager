
/**
 * Hook for searching clients
 */
import { useState } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { Client } from '@/types/client';
import { findClientByEmail, findClientByPhone } from '@/services/client/clientOperations';

export function useClientSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<Client | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const { businessId } = useTenant();

  const searchClientByEmail = async (email: string): Promise<Client | null> => {
    if (!email || !businessId) {
      return null;
    }
    
    setIsSearching(true);
    setSearchError(null);
    
    try {
      const client = await findClientByEmail(email, businessId);
      setSearchResult(client);
      return client;
    } catch (err: any) {
      setSearchError(err.message || 'Erro ao buscar cliente por email');
      return null;
    } finally {
      setIsSearching(false);
    }
  };

  const searchClientByPhone = async (phone: string): Promise<Client | null> => {
    if (!phone || !businessId) {
      return null;
    }
    
    setIsSearching(true);
    setSearchError(null);
    
    try {
      const client = await findClientByPhone(phone, businessId);
      setSearchResult(client);
      return client;
    } catch (err: any) {
      setSearchError(err.message || 'Erro ao buscar cliente por telefone');
      return null;
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResult(null);
    setSearchError(null);
  };

  return {
    searchClientByEmail,
    searchClientByPhone,
    clearSearch,
    searchResult,
    searchError,
    isSearching
  };
}
