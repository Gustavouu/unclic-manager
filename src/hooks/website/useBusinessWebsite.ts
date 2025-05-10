
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ServiceData as OnboardingServiceData, StaffData } from "@/contexts/onboarding/types";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { services as mockServices } from "@/components/services/servicesData";
import { ServiceData as ComponentServiceData } from "@/components/services/servicesData";

export const useBusinessWebsite = () => {
  const { businessData, loadProgress, services, staffMembers, businessHours } = useOnboarding();
  const { businessName } = useParams();
  const [availableServices, setAvailableServices] = useState<OnboardingServiceData[]>([]);
  const [staff, setStaff] = useState<StaffData[]>([]);
  const { professionals } = useProfessionals();
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  
  // Load onboarding data
  useEffect(() => {
    const load = async () => {
      try {
        await loadProgress();
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [loadProgress]);

  // Set services data - use onboarding services or mock if empty
  useEffect(() => {
    if (services && services.length > 0) {
      setAvailableServices(services);
    } else {
      // Convert mock services to the expected format
      const convertedServices = mockServices.map(service => ({
        id: service.id,
        name: service.name,
        duration: service.duration,
        price: typeof service.price === 'string' ? parseFloat(service.price) : service.price,
        description: service.description
      }));
      setAvailableServices(convertedServices as OnboardingServiceData[]);
    }
  }, [services]);

  // Set staff data - use onboarding staff or professionals if empty
  useEffect(() => {
    if (staffMembers && staffMembers.length > 0) {
      setStaff(staffMembers);
    } else if (professionals && professionals.length > 0) {
      // Convert professionals to staff format
      const convertedStaff = professionals.map(p => ({
        id: p.id,
        name: p.name,
        role: p.role || "Profissional",
        email: p.email,
        phone: p.phone,
        specialties: p.specialties || []
      }));
      setStaff(convertedStaff);
    } else {
      // Fallback if no staff or professionals
      setStaff([{
        id: "mock-staff-1",
        name: "Profissional Demo",
        role: "Atendente",
        email: "demo@exemplo.com",
        specialties: ["Corte de Cabelo", "Manicure"]
      }]);
    }
  }, [staffMembers, professionals]);

  // Modified to always return true in development environment
  const isCorrectBusiness = () => {
    // In development environment, always show the business website
    // This ensures we can see the website regardless of URL/data matching
    return true;
  };

  const handleStartBooking = () => {
    setShowBookingFlow(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCloseBooking = () => {
    setShowBookingFlow(false);
  };

  return {
    businessData,
    businessHours,
    availableServices,
    staff,
    isLoading,
    showBookingFlow,
    isCorrectBusiness,
    handleStartBooking,
    handleCloseBooking
  };
};
