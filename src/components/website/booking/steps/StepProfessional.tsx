
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StaffData } from "@/contexts/onboarding/types";
import { BookingData } from "../WebsiteBookingFlow";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface StepProfessionalProps {
  staff: StaffData[];
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  nextStep: () => void;
}

export function StepProfessional({
  staff,
  bookingData,
  updateBookingData,
  nextStep
}: StepProfessionalProps) {
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(
    bookingData.professionalId || null
  );

  const handleProfessionalSelect = (professional: StaffData) => {
    setSelectedProfessional(professional.id);
    updateBookingData({
      professionalId: professional.id,
      professionalName: professional.name
    });
  };

  const handleContinue = () => {
    if (selectedProfessional) {
      nextStep();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Escolha um Profissional</CardTitle>
        <p className="text-muted-foreground mt-2">
          Selecione o profissional para realizar o serviço
          {bookingData.serviceName && (
            <span className="font-medium"> "{bookingData.serviceName}"</span>
          )}
        </p>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        {staff.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum profissional disponível.</p>
          </div>
        ) : (
          staff.map((professional) => (
            <div
              key={professional.id}
              onClick={() => handleProfessionalSelect(professional)}
              className={`
                p-4 border rounded-lg transition-all cursor-pointer
                ${selectedProfessional === professional.id 
                  ? 'border-primary bg-primary/5' 
                  : 'hover:bg-accent/50'
                }
              `}
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(professional.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{professional.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {professional.role}
                  </p>
                  
                  {professional.specialties && professional.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {professional.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          disabled={!selectedProfessional}
          onClick={handleContinue}
        >
          Continuar
        </Button>
      </CardFooter>
    </Card>
  );
}
