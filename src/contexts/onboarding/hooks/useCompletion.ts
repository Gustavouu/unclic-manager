
import { useCallback } from "react";
import { BusinessData, ServiceData, StaffData } from "../types";
import { checkOnboardingComplete } from "../utils";

export const useCompletion = (
  businessData: BusinessData,
  services: ServiceData[],
  staffMembers: StaffData[],
  hasStaff: boolean
) => {
  // Check if all required information is complete
  const isComplete = useCallback(() => {
    return checkOnboardingComplete(businessData, services, staffMembers, hasStaff);
  }, [businessData, services, staffMembers, hasStaff]);

  return { isComplete };
};
