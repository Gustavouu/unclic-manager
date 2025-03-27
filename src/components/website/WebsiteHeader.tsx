
import React from "react";
import { BusinessData } from "@/contexts/onboarding/types";
import { MapPin, Phone, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WebsiteHeaderProps {
  businessData: BusinessData;
  onStartBooking: () => void;
}

export const WebsiteHeader: React.FC<WebsiteHeaderProps> = ({
  businessData,
  onStartBooking
}) => {
  return (
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
  );
};
