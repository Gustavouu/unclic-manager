
import React from "react";
import { ServiceData, StaffData, BusinessData, BusinessHours } from "@/contexts/onboarding/types";
import { AboutSection } from "./AboutSection";
import { ServicesSection } from "./ServicesSection";
import { ProfessionalsSection } from "./ProfessionalsSection";
import { PaymentSection } from "./PaymentSection";
import { WebsiteFooter } from "./WebsiteFooter";
import { formatWeekday, formatPrice, formatDuration } from "./WebsiteUtils";
import { AppointmentSection } from "./AppointmentSection";
import { WebsiteHeader } from "./WebsiteHeader";

interface WebsiteMainContentProps {
  businessData: BusinessData;
  businessHours: BusinessHours | null;
  availableServices: ServiceData[];
  staff: StaffData[];
  onStartBooking: () => void;
}

export const WebsiteMainContent: React.FC<WebsiteMainContentProps> = ({
  businessData,
  businessHours,
  availableServices,
  staff,
  onStartBooking
}) => {
  return (
    <>
      {/* Use the WebsiteHeader component instead of duplicating code */}
      <WebsiteHeader
        businessData={businessData}
        onStartBooking={onStartBooking}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-6">
          {/* About Section */}
          <AboutSection 
            businessData={businessData} 
            businessHours={businessHours}
            formatWeekday={formatWeekday}
          />
          
          {/* Appointment Section */}
          <AppointmentSection onStartBooking={onStartBooking} />
        </div>
        
        {/* Main Content Sections - Right Column */}
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
  );
};
