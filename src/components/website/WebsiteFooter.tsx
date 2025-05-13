
import React from "react";
import { formatSocialMediaUrl } from "./WebsiteUtils";
import { ExternalLink } from "lucide-react";
import { BusinessData } from "@/contexts/onboarding/types";

interface WebsiteFooterProps {
  businessName: string;
  businessData?: BusinessData;
}

export const WebsiteFooter: React.FC<WebsiteFooterProps> = ({ businessName, businessData }) => {
  return (
    <div className="mt-16 pt-8 border-t">
      <div className="text-center">
        <p className="text-lg font-medium">{businessName}</p>
        
        {businessData?.address && (
          <p className="mt-1 text-muted-foreground">
            {businessData.address}
            {businessData.number || businessData.addressNumber ? `, ${businessData.number || businessData.addressNumber}` : ''}
            {businessData.neighborhood ? ` - ${businessData.neighborhood}` : ''}
            {businessData.city ? `, ${businessData.city}` : ''}
            {businessData.state ? ` - ${businessData.state}` : ''}
          </p>
        )}
        
        {businessData?.socialMedia && Object.values(businessData.socialMedia).some(url => url) && (
          <div className="flex justify-center gap-4 mt-4">
            {businessData.socialMedia.facebook && (
              <a 
                href={formatSocialMediaUrl(businessData.socialMedia.facebook)}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <span className="flex items-center gap-1">Facebook <ExternalLink className="h-3 w-3" /></span>
              </a>
            )}
            {businessData.socialMedia.instagram && (
              <a 
                href={formatSocialMediaUrl(businessData.socialMedia.instagram)}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-800"
              >
                <span className="flex items-center gap-1">Instagram <ExternalLink className="h-3 w-3" /></span>
              </a>
            )}
            {businessData.socialMedia.twitter && (
              <a 
                href={formatSocialMediaUrl(businessData.socialMedia.twitter)}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-600"
              >
                <span className="flex items-center gap-1">Twitter <ExternalLink className="h-3 w-3" /></span>
              </a>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} {businessName}. Todos os direitos reservados.</p>
        <p className="mt-1">
          Criado com <a href="/" className="text-primary hover:underline">unclic</a>
        </p>
      </div>
    </div>
  );
};
