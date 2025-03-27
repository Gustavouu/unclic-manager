
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BookingData, ExtendedStaffData } from "../WebsiteBookingFlow";

interface StepProfessionalProps {
  staff: ExtendedStaffData[];
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [filteredStaff, setFilteredStaff] = useState<ExtendedStaffData[]>(staff);

  // Extract all unique specialties from staff
  const allSpecialties = [...new Set(staff.flatMap(p => p.specialties || []))];

  // Filter staff based on search query and specialty filter
  useEffect(() => {
    let filtered = staff;
    
    if (searchQuery) {
      filtered = filtered.filter(professional => 
        professional.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        professional.role?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedSpecialty) {
      filtered = filtered.filter(professional => 
        professional.specialties?.includes(selectedSpecialty)
      );
    }
    
    setFilteredStaff(filtered);
  }, [searchQuery, selectedSpecialty, staff]);

  const handleProfessionalSelect = (professional: ExtendedStaffData) => {
    setSelectedProfessional(professional.id);
    updateBookingData({
      professionalId: professional.id,
      professionalName: professional.name
    });
  };

  const handleSpecialtyClick = (specialty: string) => {
    setSelectedSpecialty(prev => prev === specialty ? null : specialty);
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

        <div className="space-y-4 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar profissionais..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {allSpecialties.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center mb-2">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Especialidades</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {allSpecialties.map((specialty) => (
                  <Badge 
                    key={specialty} 
                    variant={selectedSpecialty === specialty ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleSpecialtyClick(specialty)}
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        {filteredStaff.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhum profissional encontrado.</p>
          </div>
        ) : (
          filteredStaff.map((professional) => (
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
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(professional.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{professional.name}</h3>
                    {professional.availability && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                        Disponível hoje
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {professional.role}
                  </p>
                  
                  {professional.bio && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {professional.bio}
                    </p>
                  )}
                  
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
