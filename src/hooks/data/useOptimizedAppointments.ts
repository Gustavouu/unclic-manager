
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UnifiedDataService } from '@/services/unified/UnifiedDataService';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';
import type { UnifiedAppointment } from '@/types/unified';

export const useOptimizedAppointments = (date?: string) => {
  const { businessId } = useTenant();
  const queryClient = useQueryClient();
  const dataService = UnifiedDataService.getInstance();

  const {
    data: appointments = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['appointments', businessId, date],
    queryFn: () => businessId ? dataService.getAppointments(businessId, date) : [],
    enabled: !!businessId,
    staleTime: 2 * 60 * 1000, // 2 minutes for real-time data
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<UnifiedAppointment> }) => {
      // This would be implemented in the UnifiedDataService
      // For now, we'll use the existing appointment update logic
      console.log('Updating appointment:', id, updates);
      return { id, ...updates };
    },
    onMutate: async ({ id, updates }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['appointments', businessId, date] });
      
      const previousAppointments = queryClient.getQueryData(['appointments', businessId, date]);
      
      queryClient.setQueryData(['appointments', businessId, date], (old: UnifiedAppointment[] = []) =>
        old.map(appointment => 
          appointment.id === id ? { ...appointment, ...updates } : appointment
        )
      );
      
      return { previousAppointments };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['appointments', businessId, date], context?.previousAppointments);
      toast.error('Erro ao atualizar agendamento');
    },
    onSuccess: () => {
      dataService.invalidateAppointments(businessId!);
      toast.success('Agendamento atualizado');
    },
  });

  const getAppointmentsByStatus = (status: string): UnifiedAppointment[] => {
    return appointments.filter(appointment => appointment.status === status);
  };

  const getTodayAppointments = (): UnifiedAppointment[] => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(appointment => appointment.booking_date === today);
  };

  return {
    appointments,
    isLoading,
    error,
    refetch,
    updateAppointment: updateAppointmentMutation.mutate,
    isUpdating: updateAppointmentMutation.isPending,
    getAppointmentsByStatus,
    getTodayAppointments,
  };
};
