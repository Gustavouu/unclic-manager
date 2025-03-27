
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-4 pb-8 overflow-y-auto"
    >
      <div className="relative w-full max-w-5xl mx-4">
        <Button 
          size="icon" 
          variant="outline" 
          className="absolute right-6 top-6 z-10 bg-white hover:bg-gray-100"
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
}
