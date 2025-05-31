
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
import { BusinessData as WebsiteBusinessData } from "@/hooks/useBusinessWebsite";

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
  // Convert BusinessData to WebsiteBusinessData format
  const websiteBusinessData: WebsiteBusinessData = {
    id: businessData.id,
    name: businessData.name,
    description: businessData.description,
    logo_url: businessData.logoUrl,
    phone: businessData.phone,
    address: businessData.address,
    address_number: businessData.addressNumber,
    city: businessData.city,
    state: businessData.state,
    zip_code: businessData.zipCode,
    admin_email: businessData.adminEmail || '',
    neighborhood: businessData.neighborhood
  };

  // Convert ServiceData to SimpleService format
  const simpleServices = availableServices.map(service => ({
    id: service.id,
    name: service.nome,
    description: service.descricao,
    price: service.preco,
    duration: service.duracao,
    business_id: businessData.id,
    is_active: service.ativo
  }));

  // Convert StaffData to website StaffData format
  const websiteStaff = staff.map(member => ({
    ...member,
    business_id: businessData.id,
    role: member.role || 'staff'
  }));

  return (
    <>
      <WebsiteHeader
        business={websiteBusinessData}
        onBookingClick={onStartBooking}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-6">
          {/* About Section */}
          <AboutSection business={websiteBusinessData} />
          
          {/* Appointment Section */}
          <AppointmentSection 
            business={websiteBusinessData}
            onBookingClick={onStartBooking}
          />
        </div>
        
        {/* Main Content Sections - Right Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Services Section */}
          <ServicesSection 
            services={simpleServices}
            onBookingClick={onStartBooking}
          />
          
          {/* Professionals Section */}
          <ProfessionalsSection 
            staff={websiteStaff}
            onBookingClick={onStartBooking}
          />
          
          {/* Payment Section */}
          <PaymentSection />
        </div>
      </div>
      
      {/* Footer */}
      <WebsiteFooter business={websiteBusinessData} />
    </>
  );
};
