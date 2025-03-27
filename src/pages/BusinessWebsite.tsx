import React, { useEffect, useState } from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { useParams, useNavigate } from "react-router-dom";
import { ServiceData, StaffData } from "@/contexts/onboarding/types";
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { services as mockServices } from "@/components/services/servicesData";
import { MapPin } from "lucide-react";

// Import our new components
import { WebsiteBanner } from "@/components/website/WebsiteBanner";
import { AboutSection } from "@/components/website/AboutSection";
import { ServicesSection } from "@/components/website/ServicesSection";
import { ProfessionalsSection } from "@/components/website/ProfessionalsSection";
import { AppointmentSection } from "@/components/website/AppointmentSection";
import { PaymentSection } from "@/components/website/PaymentSection";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { WebsiteLoading } from "@/components/website/WebsiteLoading";
import { formatWeekday, formatPrice, formatDuration } from "@/components/website/WebsiteUtils";

const BusinessWebsite = () => {
  const { businessData, loadProgress, services, staffMembers, businessHours } = useOnboarding();
  const { businessName } = useParams();
  const navigate = useNavigate();
  const [availableServices, setAvailableServices] = useState<ServiceData[]>([]);
  const [staff, setStaff] = useState<StaffData[]>([]);
  const { professionals } = useProfessionals();
  
  useEffect(() => {
    loadProgress();
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
    if (!businessData.name) return false;
    
    const formattedName = businessData.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
    
    return businessName === formattedName;
  };

  if (!businessData.name) {
    return <WebsiteLoading type="loading" />;
  }

  if (!isCorrectBusiness()) {
    return <WebsiteLoading type="not-found" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Component */}
      <WebsiteBanner businessData={businessData} />

      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{businessData.name}</h1>
          {businessData.address && (
            <p className="text-muted-foreground mt-2 flex items-center justify-center gap-1">
              <MapPin className="h-4 w-4" />
              {businessData.address}
              {businessData.number && `, ${businessData.number}`}
              {businessData.neighborhood && ` - ${businessData.neighborhood}`}
              {businessData.city && `, ${businessData.city}`}
              {businessData.state && ` - ${businessData.state}`}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* About Section */}
          <AboutSection 
            businessData={businessData} 
            businessHours={businessHours}
            formatWeekday={formatWeekday}
          />
          
          {/* Main Content Sections */}
          <div className="md:col-span-2 space-y-6">
            {/* Services Section */}
            <ServicesSection 
              services={availableServices} 
              formatPrice={formatPrice}
              formatDuration={formatDuration}
            />
            
            {/* Professionals Section */}
            <ProfessionalsSection staff={staff} />
            
            {/* Appointment Section */}
            <AppointmentSection />
            
            {/* Payment Section */}
            <PaymentSection />
          </div>
        </div>
        
        {/* Footer */}
        <WebsiteFooter businessName={businessData.name} />
      </div>
    </div>
  );
};

export default BusinessWebsite;
