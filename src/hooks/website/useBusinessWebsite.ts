
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ServiceData, StaffData } from "@/contexts/onboarding/types";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { services as mockServices } from "@/components/services/servicesData";

export const useBusinessWebsite = () => {
  const { businessData, loadProgress, services, staffMembers, businessHours } = useOnboarding();
  const { businessName } = useParams();
  const [availableServices, setAvailableServices] = useState<ServiceData[]>([]);
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
      // Use mock services as fallback
      setAvailableServices(mockServices);
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
    }
  }, [staffMembers, professionals]);

  // Check if this business exists
  const isCorrectBusiness = () => {
    if (!businessData || !businessData.name) return false;
    
    // Extrair o nome do negócio da URL (remover a extensão .unclic.com.br)
    const urlBusinessName = businessName ? businessName.replace(/\.unclic\.com\.br$/, "") : "";
    
    // Formatar o nome do negócio para comparação
    const formattedBusinessName = businessData.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
    
    console.log("URL Business Name:", urlBusinessName);
    console.log("Formatted Business Name:", formattedBusinessName);
    
    return urlBusinessName === formattedBusinessName;
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
