
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { WebsiteBookingFlow } from "./booking/WebsiteBookingFlow";
import { ServiceData, StaffData } from "@/contexts/onboarding/types";

interface WebsiteBookingModalProps {
  show: boolean;
  onClose: () => void;
  services: ServiceData[];
  staff: StaffData[];
  businessName: string;
}

export const WebsiteBookingModal: React.FC<WebsiteBookingModalProps> = ({
  show,
  onClose,
  services,
  staff,
  businessName
}) => {
  if (!show) return null;
  
  return (
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
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <WebsiteBookingFlow 
          services={services} 
          staff={staff} 
          businessName={businessName}
          closeFlow={onClose}
        />
      </div>
    </motion.div>
  );
};
