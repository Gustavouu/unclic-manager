
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { StaffData } from "@/contexts/onboarding/types";
import { toast } from "sonner";

interface ProfessionalsSectionProps {
  staff: StaffData[];
}

export const ProfessionalsSection: React.FC<ProfessionalsSectionProps> = ({ staff }) => {
  if (!staff || staff.length === 0) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <Users className="h-5 w-5" />
          Nossa Equipe
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {staff.slice(0, 6).map((person) => (
            <div 
              key={person.id} 
              className="p-4 border rounded-lg text-center hover:bg-gray-50 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto flex items-center justify-center">
                <span className="text-lg font-medium text-gray-600">
                  {person.name.charAt(0)}
                </span>
              </div>
              
              <h3 className="font-medium mt-2">{person.name}</h3>
              <p className="text-sm text-muted-foreground">{person.role}</p>
              
              {person.specialties && person.specialties.length > 0 && (
                <div className="mt-2 flex flex-wrap justify-center gap-1">
                  {person.specialties.slice(0, 2).map((specialty, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {person.specialties.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{person.specialties.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {staff.length > 6 && (
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => toast.info("Ver todos os profissionais")}>
              Ver todos os profissionais ({staff.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
