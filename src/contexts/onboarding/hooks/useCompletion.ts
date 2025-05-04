
import { BusinessData, ServiceData, StaffData } from '../types';

export const useCompletion = (
  businessData: BusinessData,
  services: ServiceData[],
  staffMembers: StaffData[],
  hasStaff: boolean,
) => {
  // Check if the onboarding process is complete
  const isComplete = (): boolean => {
    // Check if required business data is filled
    const businessDataComplete = !!(
      businessData.name &&
      businessData.email &&
      businessData.phone
    );
    
    // Check if at least one service is defined
    const servicesComplete = services.length > 0;
    
    // Check staff requirements
    const staffComplete = hasStaff 
      ? staffMembers.length > 0  // If business has staff, at least one must be added
      : true;                   // If no staff (solo business), this step is complete
    
    // All required steps must be complete
    return businessDataComplete && servicesComplete && staffComplete;
  };

  return { isComplete };
};
