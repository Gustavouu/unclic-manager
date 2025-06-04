
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UnifiedDataService } from '@/services/unified/UnifiedDataService';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';
import type { UnifiedClient } from '@/types/unified';

export const useOptimizedClients = () => {
  const { businessId } = useTenant();
  const queryClient = useQueryClient();
  const dataService = UnifiedDataService.getInstance();

  const {
    data: clients = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['clients', businessId],
    queryFn: () => businessId ? dataService.getClients(businessId) : [],
    enabled: !!businessId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  const createClientMutation = useMutation({
    mutationFn: (clientData: Partial<UnifiedClient>) => {
      if (!businessId) throw new Error('Business ID required');
      return dataService.createClient(businessId, clientData);
    },
    onSuccess: (newClient) => {
      queryClient.setQueryData(['clients', businessId], (old: UnifiedClient[] = []) => [
        newClient,
        ...old
      ]);
      dataService.invalidateClients(businessId!);
      toast.success('Cliente criado com sucesso');
    },
    onError: (error: any) => {
      console.error('Error creating client:', error);
      toast.error('Erro ao criar cliente');
    }
  });

  const searchClients = (searchTerm: string): UnifiedClient[] => {
    if (!searchTerm.trim()) return clients;
    
    const term = searchTerm.toLowerCase();
    return clients.filter(client => 
      client.name.toLowerCase().includes(term) ||
      client.email?.toLowerCase().includes(term) ||
      client.phone?.includes(term)
    );
  };

  return {
    clients,
    isLoading,
    error,
    refetch,
    createClient: createClientMutation.mutate,
    isCreating: createClientMutation.isPending,
    searchClients,
  };
};

export const useOptimizedClient = (clientId: string) => {
  const dataService = UnifiedDataService.getInstance();

  return useQuery({
    queryKey: ['client', clientId],
    queryFn: () => dataService.getClient(clientId),
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
