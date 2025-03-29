
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingData, ExtendedStaffData } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepProfessionalProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  nextStep: () => void;
  staff: ExtendedStaffData[];
}

export function StepProfessional({ 
  bookingData, 
  updateBookingData, 
  nextStep,
  staff 
}: StepProfessionalProps) {
  const [selectedProfessional, setSelectedProfessional] = useState<string>(bookingData.professionalId || "");
  
  // Filter professionals based on the selected service
  const filteredProfessionals = useMemo(() => {
    if (!bookingData.serviceId) return staff;
    
    return staff.filter(professional => {
      // If no specialties defined, assume they can do all services
      if (!professional.specialties || professional.specialties.length === 0) {
        return true;
      }
      
      // Check if this professional is specialized in the selected service
      return professional.specialties.some(
        specialty => specialty.toLowerCase().includes(bookingData.serviceName.toLowerCase())
      );
    });
  }, [staff, bookingData.serviceId, bookingData.serviceName]);
  
  const handleProfessionalSelect = (professionalId: string, professionalName: string) => {
    setSelectedProfessional(professionalId);
    updateBookingData({ professionalId, professionalName });
  };
  
  const handleContinue = () => {
    if (selectedProfessional) {
      nextStep();
    }
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Escolha o profissional</CardTitle>
        <p className="text-muted-foreground mt-2">
          Selecione o profissional para o serviço
          {bookingData.serviceName && (
            <span className="font-medium"> "{bookingData.serviceName}"</span>
          )}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {filteredProfessionals.length === 0 ? (
          <div className="text-center p-4 border border-dashed rounded-md">
            <Users className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">
              Não há profissionais disponíveis para este serviço.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProfessionals.map((professional) => (
              <button
                key={professional.id}
                className={cn(
                  "flex flex-col items-center text-center p-4 rounded-md border transition-all h-full",
                  selectedProfessional === professional.id
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                )}
                onClick={() => handleProfessionalSelect(professional.id, professional.name)}
              >
                <Avatar className="h-20 w-20 mb-4">
                  {professional.photo_url ? (
                    <AvatarImage src={professional.photo_url} alt={professional.name} />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {professional.name.charAt(0)}
                      {professional.name.split(" ")[1]?.charAt(0) || ""}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <h3 className="font-medium text-lg">{professional.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{professional.role}</p>
                
                {professional.specialties && professional.specialties.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1 mt-2">
                    {professional.specialties.slice(0, 3).map((specialty, index) => (
                      <span 
                        key={index} 
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                    {professional.specialties.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        +{professional.specialties.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          disabled={!selectedProfessional || filteredProfessionals.length === 0}
          onClick={handleContinue}
        >
          Continuar
        </Button>
      </CardFooter>
    </Card>
  );
}
