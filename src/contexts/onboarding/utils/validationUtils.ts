
import { BusinessData, ServiceData, StaffData, BusinessHours } from "../types";

/**
 * Verifica se o onboarding está completo baseado nos dados fornecidos
 */
export const checkOnboardingComplete = (
  businessData: BusinessData,
  services: ServiceData[],
  staff: StaffData[],
  businessHours: BusinessHours | null,
  hasStaff: boolean
): boolean => {
  // Verifica dados básicos do negócio
  const hasBasicBusinessInfo = !!(
    businessData.name?.trim() &&
    businessData.adminEmail?.trim() &&
    businessData.phone?.trim()
  );

  // Verifica se tem pelo menos um serviço
  const hasServices = services.length > 0;

  // Verifica funcionários (apenas se indicou que tem funcionários)
  const hasRequiredStaff = !hasStaff || staff.length > 0;

  // Verifica horários de funcionamento
  const hasBusinessHours = businessHours !== null;

  return hasBasicBusinessInfo && hasServices && hasRequiredStaff && hasBusinessHours;
};
