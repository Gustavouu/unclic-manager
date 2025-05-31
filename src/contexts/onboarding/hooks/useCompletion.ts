
import { BusinessData, ServiceData, StaffData, BusinessHours } from '../types';

export const useCompletion = (
  businessData: BusinessData,
  services: ServiceData[],
  staff: StaffData[],
  businessHours: BusinessHours | null
) => {
  const completeOnboarding = async () => {
    try {
      // Validate required data
      if (!businessData.name || !businessData.adminEmail) {
        throw new Error('Dados obrigatórios não preenchidos');
      }

      console.log('Completing onboarding with data:', {
        businessData,
        services,
        staff,
        businessHours
      });

      // Here you would typically save to database
      // For now, just mark as complete
      return Promise.resolve();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  };

  return {
    completeOnboarding,
  };
};
