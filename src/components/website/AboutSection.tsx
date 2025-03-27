
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Mail, Phone } from "lucide-react";
import { ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { BusinessData, BusinessHours } from "@/contexts/onboarding/types";

interface AboutSectionProps {
  businessData: BusinessData;
  businessHours: BusinessHours | null;
  formatWeekday: (day: string) => string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ 
  businessData, 
  businessHours,
  formatWeekday 
}) => {
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle className="text-xl">Sobre Nós</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Bem-vindo a {businessData.name}! Somos especializados em 
          oferecer os melhores serviços com qualidade e conforto para 
          nossos clientes.
        </p>
        
        <div className="space-y-2">
          {businessData.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{businessData.phone}</span>
            </div>
          )}
          
          {businessData.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{businessData.email}</span>
            </div>
          )}
        </div>
        
        {businessHours && Object.keys(businessHours).length > 0 && (
          <>
            <Separator />
            
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Horário de Funcionamento
              </h3>
              <div className="space-y-1 text-sm">
                {Object.entries(businessHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="font-medium">{formatWeekday(day)}</span>
                    {hours.open ? (
                      <span>{hours.openTime} - {hours.closeTime}</span>
                    ) : (
                      <span className="text-muted-foreground">Fechado</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        {businessData.socialMedia && (
          <>
            <Separator />
            
            <div className="space-y-2">
              <h3 className="font-medium">Redes Sociais</h3>
              <div className="flex flex-wrap gap-2">
                {businessData.socialMedia?.facebook && (
                  <a 
                    href={businessData.socialMedia.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    Facebook <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                
                {businessData.socialMedia?.instagram && (
                  <a 
                    href={businessData.socialMedia.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-pink-600 hover:underline"
                  >
                    Instagram <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                
                {businessData.socialMedia?.linkedin && (
                  <a 
                    href={businessData.socialMedia.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-800 hover:underline"
                  >
                    LinkedIn <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                
                {businessData.socialMedia?.twitter && (
                  <a 
                    href={businessData.socialMedia.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-400 hover:underline"
                  >
                    Twitter <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
