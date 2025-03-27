
import React from "react";
import { AnimatePresence } from "framer-motion";
import { WebsiteBanner } from "@/components/website/WebsiteBanner";
import { WebsiteLoading } from "@/components/website/WebsiteLoading";
import { WebsiteHeader } from "@/components/website/WebsiteHeader";
import { WebsiteBookingModal } from "@/components/website/WebsiteBookingModal";
import { AboutSection } from "@/components/website/AboutSection";
import { ServicesSection } from "@/components/website/ServicesSection";
import { ProfessionalsSection } from "@/components/website/ProfessionalsSection";
import { PaymentSection } from "@/components/website/PaymentSection";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { formatWeekday, formatPrice, formatDuration } from "@/components/website/WebsiteUtils";
import { useBusinessWebsite } from "@/hooks/website/useBusinessWebsite";
import { MapPin, Phone, Mail } from "lucide-react";

const BusinessWebsite = () => {
  const {
    businessData,
    businessHours,
    availableServices,
    staff,
    isLoading,
    showBookingFlow,
    isCorrectBusiness,
    handleStartBooking,
    handleCloseBooking
  } = useBusinessWebsite();

  if (isLoading) {
    return <WebsiteLoading type="loading" />;
  }

  // For debug purposes, show loaded business data
  console.log("Business Data:", businessData);

  // If there's no business data or the business doesn't match, show not found
  if (!businessData.name || !isCorrectBusiness()) {
    return <WebsiteLoading type="not-found" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Component */}
      <WebsiteBanner businessData={businessData} />

      <AnimatePresence>
        {showBookingFlow && (
          <WebsiteBookingModal
            show={showBookingFlow}
            onClose={handleCloseBooking}
            services={availableServices}
            staff={staff}
            businessName={businessData.name}
          />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 pt-16 pb-8">
        {!showBookingFlow && (
          <>
            {/* Header with Business Info and Booking Button */}
            <WebsiteHeader
              businessData={businessData}
              onStartBooking={handleStartBooking}
            />

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
