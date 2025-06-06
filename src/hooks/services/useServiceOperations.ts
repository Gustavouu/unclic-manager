
import { useState } from 'react';
import { ServiceService } from '@/services/service/serviceService';
import { useCurrentBusiness } from '@/hooks/useCurrentBusiness';
import { toast } from 'sonner';
import type { Service, ServiceFormData } from '@/types/service';

export const useServiceOperations = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { businessId } = useCurrentBusiness();
  const serviceService = ServiceService.getInstance();

  const createService = async (serviceData: ServiceFormData): Promise<Service | null> => {
    if (!businessId) {
      toast.error('Business ID não encontrado');
      return null;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Creating service:', serviceData);
      const result = await serviceService.create({ ...serviceData, business_id: businessId });
      toast.success('Serviço criado com sucesso!');
      return result;
    } catch (error: any) {
      console.error('Error creating service:', error);
      toast.error('Erro ao criar serviço');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateService = async (serviceId: string, serviceData: ServiceFormData): Promise<Service | null> => {
    setIsSubmitting(true);
    try {
      console.log('Updating service:', serviceId, serviceData);
      const result = await serviceService.update(serviceId, serviceData);
      toast.success('Serviço atualizado com sucesso!');
      return result;
    } catch (error: any) {
      console.error('Error updating service:', error);
      toast.error('Erro ao atualizar serviço');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteService = async (serviceId: string): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      console.log('Deleting service:', serviceId);
      await serviceService.delete(serviceId);
      toast.success('Serviço excluído com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Error deleting service:', error);
      toast.error('Erro ao excluir serviço');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean): Promise<Service | null> => {
    setIsSubmitting(true);
    try {
      console.log('Toggling service status:', serviceId, currentStatus);
      const result = await serviceService.update(serviceId, { is_active: !currentStatus });
      toast.success(`Serviço ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`);
      return result;
    } catch (error: any) {
      console.error('Error toggling service status:', error);
      toast.error('Erro ao alterar status do serviço');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createService,
    updateService,
    deleteService,
    toggleServiceStatus,
    isSubmitting,
  };
};
