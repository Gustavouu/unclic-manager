import React from "react";
import { AnimatePresence } from "framer-motion";
import { WebsiteBanner } from "@/components/website/WebsiteBanner";
import { WebsiteLoading } from "@/components/website/WebsiteLoading";
import { WebsiteMainContent } from "@/components/website/WebsiteMainContent";
import { WebsiteBookingModal } from "@/components/website/WebsiteBookingModal";
import { useBusinessWebsite } from "@/hooks/useBusinessWebsite";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BusinessWebsite = () => {
  const {
    business: businessData, 
    services: availableServices,
    staff,
    loading: isLoading,
    error,
    isBookingOpen: showBookingFlow,
    checkIsCorrectBusiness: isCorrectBusiness,
    startBooking: handleStartBooking,
    closeBooking: handleCloseBooking
  } = useBusinessWebsite();

  // Adding a business hours property
  const businessHours = businessData?.working_hours || {};

  if (isLoading) {
    return <WebsiteLoading type="loading" />;
  }

  // For debug purposes, show loaded business data
  console.log("Business Data:", businessData);

  // Call isCorrectBusiness with the required argument
  if (!isCorrectBusiness(businessData?.id)) {
    return <WebsiteLoading type="not-found" />;
  }

  // Create a fallback business data object if businessData is incomplete
  const displayBusinessData = {
    name: businessData?.name || "Estabelecimento Demo",
    email: businessData?.email || businessData?.admin_email || "contato@demo.com",
    phone: businessData?.phone || "(11) 9999-9999",
    address: businessData?.address || "Av. Exemplo",
    number: businessData?.address_number || businessData?.number || "123",
    neighborhood: businessData?.neighborhood || "Centro",
    city: businessData?.city || "São Paulo",
    state: businessData?.state || "SP",
    description: businessData?.description || "Descrição não disponível",
    ...businessData
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Only show banner when booking flow is not visible */}
      {!showBookingFlow && (
        <WebsiteBanner businessData={displayBusinessData} />
      )}

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

      <div className="container mx-auto px-4 py-6">
        {!showBookingFlow && (
          <div className="space-y-6">
            <Card className="border shadow-sm">
              <CardHeader className="pb-3 border-b bg-white">
                <CardTitle className="text-lg">Sobre o Estabelecimento</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <img 
                      src={businessData?.logo_url || "https://via.placeholder.com/300x200?text=Logo"} 
                      alt={`${displayBusinessData.name} logo`}
                      className="w-full h-auto rounded-lg shadow-sm"
                    />
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="text-xl font-semibold mb-2">{displayBusinessData.name}</h2>
                    <p className="text-muted-foreground mb-4">
                      {displayBusinessData.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium mb-1">Contato</h3>
                        <p className="text-sm">{displayBusinessData.email}</p>
                        <p className="text-sm">{displayBusinessData.phone}</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Endereço</h3>
                        <p className="text-sm">
                          {displayBusinessData.address}, {displayBusinessData.number}
                        </p>
                        <p className="text-sm">
                          {displayBusinessData.neighborhood} - {displayBusinessData.city}/{displayBusinessData.state}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <WebsiteMainContent 
              businessData={displayBusinessData}
              businessHours={businessHours}
              availableServices={availableServices}
              staff={staff}
              onStartBooking={handleStartBooking}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessWebsite;
