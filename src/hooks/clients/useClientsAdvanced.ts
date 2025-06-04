import { useState } from 'react';
import { useClientsData } from './useClientsData';
import { fetchClients, createClient, updateClient, deleteClient } from '@/services/clientService';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import type { Client, ClientStats } from '@/types/client';

export const useClientsAdvanced = () => {
  const { clients, isLoading, error, refetch } = useClientsData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { businessId } = useCurrentBusiness();

  const searchClients = async (searchTerm: string): Promise<Client[]> => {
    if (!businessId || !searchTerm.trim()) return clients;
    
    try {
      return await fetchClients(businessId);
    } catch (error) {
      console.error('Error searching clients:', error);
      return [];
    }
  };

  const getClientStats = async (clientId: string): Promise<ClientStats | null> => {
    return null;
  };

  const updateClientStatus = async (clientId: string, status: string) => {
    return true;
  };

  const updateClientPreferences = async (clientId: string, preferences: any) => {
    return true;
  };

  const getClientsByPreferredProfessional = async (professionalId: string): Promise<Client[]> => {
    return [];
  };

  const getClientsByPreferredService = async (serviceId: string): Promise<Client[]> => {
    return [];
  };

  // Analytics functions
  const getActiveClientsCount = () => {
    return clients.filter(client => client.status === 'active').length;
  };

  const getTopSpendingClients = (limit: number = 10) => {
    return [...clients]
      .sort((a, b) => (b.total_spent || 0) - (a.total_spent || 0))
      .slice(0, limit);
  };

  const getRecentClients = (days: number = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return clients.filter(client => {
      if (!client.created_at) return false;
      return new Date(client.created_at) >= cutoffDate;
    });
  };

  const getClientsWithoutRecentVisits = (days: number = 90) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return clients.filter(client => {
      if (!client.last_visit) return true;
      return new Date(client.last_visit) < cutoffDate;
    });
  };

  return {
    clients,
    isLoading,
    error,
    isSubmitting,
    refetch,
    searchClients,
    getClientStats,
    updateClientStatus,
    updateClientPreferences,
    getClientsByPreferredProfessional,
    getClientsByPreferredService,
    // Analytics
    getActiveClientsCount,
    getTopSpendingClients,
    getRecentClients,
    getClientsWithoutRecentVisits,
  };
};
