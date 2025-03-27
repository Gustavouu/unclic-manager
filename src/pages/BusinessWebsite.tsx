
import React from "react";
import { AnimatePresence } from "framer-motion";
import { WebsiteBanner } from "@/components/website/WebsiteBanner";
import { WebsiteLoading } from "@/components/website/WebsiteLoading";
import { WebsiteMainContent } from "@/components/website/WebsiteMainContent";
import { WebsiteBookingModal } from "@/components/website/WebsiteBookingModal";
import { useBusinessWebsite } from "@/hooks/website/useBusinessWebsite";

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
  // In development we'll always show the website with fallback data
  if (!isCorrectBusiness()) {
    return <WebsiteLoading type="not-found" />;
  }

  // Create a fallback business data object if businessData is incomplete
  const displayBusinessData = {
    name: businessData.name || "Estabelecimento Demo",
    email: businessData.email || "contato@demo.com",
    phone: businessData.phone || "(11) 9999-9999",
    address: businessData.address || "Av. Exemplo",
    number: businessData.number || "123",
    neighborhood: businessData.neighborhood || "Centro",
    city: businessData.city || "São Paulo",
    state: businessData.state || "SP",
    ...businessData
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Component */}
      <WebsiteBanner businessData={displayBusinessData} />

      <AnimatePresence>
        {showBookingFlow && (
          <WebsiteBookingModal
            show={showBookingFlow}
            onClose={handleCloseBooking}
            services={availableServices}
            staff={staff}
            businessName={displayBusinessData.name}
          />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 pt-16 pb-8">
        {!showBookingFlow && (
          <WebsiteMainContent 
            businessData={displayBusinessData}
            businessHours={businessHours}
            availableServices={availableServices}
            staff={staff}
            onStartBooking={handleStartBooking}
          />
        )}
      </div>
    </div>
  );
};

export default BusinessWebsite;
