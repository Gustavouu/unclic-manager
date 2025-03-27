
import React, { useEffect, useState } from "react";
import { useOnboarding } from "@/contexts/onboarding/OnboardingContext";
import { useParams, useNavigate } from "react-router-dom";
import { ServiceData, StaffData } from "@/contexts/onboarding/types";
import { useProfessionals } from "@/hooks/professionals/useProfessionals";
import { services as mockServices } from "@/components/services/servicesData";
import { MapPin, Phone, Mail, Calendar, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import our components
import { WebsiteBanner } from "@/components/website/WebsiteBanner";
import { AboutSection } from "@/components/website/AboutSection";
import { ServicesSection } from "@/components/website/ServicesSection";
import { ProfessionalsSection } from "@/components/website/ProfessionalsSection";
import { PaymentSection } from "@/components/website/PaymentSection";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { WebsiteLoading } from "@/components/website/WebsiteLoading";
import { formatWeekday, formatPrice, formatDuration } from "@/components/website/WebsiteUtils";
import { WebsiteBookingFlow } from "@/components/website/booking/WebsiteBookingFlow";
import { Button } from "@/components/ui/button";
import { AppointmentSection } from "@/components/website/AppointmentSection";

const BusinessWebsite = () => {
  const { businessData, loadProgress, services, staffMembers, businessHours } = useOnboarding();
  const { businessName } = useParams();
  const navigate = useNavigate();
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
    
    // Extract business name from URL (remove the .unclic.com.br part)
    const urlBusinessName = businessName ? businessName.replace(/\.unclic\.com\.br$/, "") : "";
    
    // Format the business name for comparison
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

  if (isLoading) {
    return <WebsiteLoading type="loading" />;
  }

  // For debug purposes, show loaded business data
  console.log("Business Data:", businessData);
  console.log("Business Name:", businessName);

  // If there's no business data or the business doesn't match, show not found
  if (!businessData.name || !isCorrectBusiness()) {
    return <WebsiteLoading type="not-found" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Component */}
      <WebsiteBanner businessData={businessData} />

      <AnimatePresence>
        {showBookingFlow ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-10 overflow-y-auto"
          >
            <div className="relative w-full max-w-3xl">
              <Button 
                size="icon" 
                variant="outline" 
                className="absolute right-4 top-4 z-10"
                onClick={() => setShowBookingFlow(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <WebsiteBookingFlow 
                services={availableServices} 
                staff={staff} 
                businessName={businessData.name}
                closeFlow={() => setShowBookingFlow(false)}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="container mx-auto px-4 pt-16 pb-8">
        {!showBookingFlow && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">{businessData.name}</h1>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-3">
                {businessData.address && (
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {businessData.address}
                    {businessData.number && `, ${businessData.number}`}
                    {businessData.city && ` - ${businessData.city}`}
                    {businessData.state && `/${businessData.state}`}
                  </p>
                )}
                
                {businessData.phone && (
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {businessData.phone}
                  </p>
                )}
                
                {businessData.email && (
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {businessData.email}
                  </p>
                )}
              </div>
              
              <div className="mt-6">
                <Button 
                  size="lg" 
                  className="gap-2"
                  onClick={handleStartBooking}
                >
                  <Calendar className="h-5 w-5" />
                  Agendar Serviço
                </Button>
              </div>
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
                
                {/* Payment Section */}
                <PaymentSection />
              </div>
            </div>
            
            {/* Footer */}
            <WebsiteFooter businessName={businessData.name} businessData={businessData} />
          </>
        )}
      </div>
    </div>
  );
};

export default BusinessWebsite;
