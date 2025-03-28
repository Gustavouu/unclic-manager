
import React from "react";
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
      className="fixed inset-0 z-50 bg-white flex items-start justify-center pt-4 pb-8 overflow-y-auto"
    >
      <div className="relative w-full max-w-5xl mx-4">
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
