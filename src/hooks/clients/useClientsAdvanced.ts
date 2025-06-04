
import { useState } from 'react';
import { useClientsData } from './useClientsData';
import { ClientService } from '@/services/client/clientService';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import type { Client, ClientStats } from '@/types/client';

export const useClientsAdvanced = () => {
  const { clients, isLoading, error, refetch } = useClientsData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { businessId } = useCurrentBusiness();

  const clientService = ClientService.getInstance();

  const searchClients = async (searchTerm: string): Promise<Client[]> => {
    if (!businessId || !searchTerm.trim()) return clients;
    
    try {
      return await clientService.search({
        business_id: businessId,
        search: searchTerm
      });
    } catch (error) {
      console.error('Error searching clients:', error);
      return [];
    }
  };

  const getClientStats = async (clientId: string): Promise<ClientStats | null> => {
    try {
      return await clientService.getStats(clientId);
    } catch (error) {
      console.error('Error fetching client stats:', error);
      return null;
    }
  };

  const updateClientStatus = async (clientId: string, status: string) => {
    setIsSubmitting(true);
    try {
      await clientService.updateStatus(clientId, status);
      await refetch();
      return true;
    } catch (error) {
      console.error('Error updating client status:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateClientPreferences = async (clientId: string, preferences: any) => {
    setIsSubmitting(true);
    try {
      await clientService.updatePreferences(clientId, preferences);
      await refetch();
      return true;
    } catch (error) {
      console.error('Error updating client preferences:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getClientsByPreferredProfessional = async (professionalId: string): Promise<Client[]> => {
    try {
      return await clientService.listByPreferredProfessional(professionalId);
    } catch (error) {
      console.error('Error fetching clients by professional:', error);
      return [];
    }
  };

  const getClientsByPreferredService = async (serviceId: string): Promise<Client[]> => {
    try {
      return await clientService.listByPreferredService(serviceId);
    } catch (error) {
      console.error('Error fetching clients by service:', error);
      return [];
    }
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
