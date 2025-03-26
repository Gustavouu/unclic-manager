
import React from "react";
import { BusinessBasicInfoSection } from "./BusinessBasicInfoSection";
import { BusinessMediaSection } from "./BusinessMediaSection";
import { BusinessAddressSection } from "./BusinessAddressSection";
import { Separator } from "@/components/ui/separator";

export const BusinessInfoStep: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BusinessBasicInfoSection />
        <BusinessMediaSection />
      </div>
      
      <Separator />
      
      <BusinessAddressSection />
    </div>
  );
};
