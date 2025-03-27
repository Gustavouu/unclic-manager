
import React from "react";
import { ServiceData, StaffData, BusinessData, BusinessHours } from "@/contexts/onboarding/types";
import { MapPin, Phone, Mail, Calendar } from "lucide-react";
import { AboutSection } from "./AboutSection";
import { ServicesSection } from "./ServicesSection";
import { ProfessionalsSection } from "./ProfessionalsSection";
import { PaymentSection } from "./PaymentSection";
import { WebsiteFooter } from "./WebsiteFooter";
import { formatWeekday, formatPrice, formatDuration } from "./WebsiteUtils";
import { Button } from "@/components/ui/button";

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
            onClick={onStartBooking}
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
  );
};
