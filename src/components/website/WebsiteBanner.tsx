
import React from "react";
import { BusinessData } from "@/contexts/onboarding/types";

interface WebsiteBannerProps {
  businessData: BusinessData;
}

export const WebsiteBanner: React.FC<WebsiteBannerProps> = ({ businessData }) => {
  return (
    <div 
      className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative"
      style={{
        backgroundImage: businessData.bannerUrl 
          ? `url(${businessData.bannerUrl})` 
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto px-4 h-full flex items-end">
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-lg">
          {businessData.logoUrl ? (
            <img 
              src={businessData.logoUrl} 
              alt={`${businessData.name} logo`} 
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-500">
                {businessData.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
