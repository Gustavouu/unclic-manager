
import React from "react";
import { LogoUpload } from "./LogoUpload";
import { BannerUpload } from "./BannerUpload";

export const BusinessMediaSection: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Mídia</h3>
      
      <div className="space-y-4">
        <LogoUpload />
        <BannerUpload />
      </div>
    </div>
  );
};
