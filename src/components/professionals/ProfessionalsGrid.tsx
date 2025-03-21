
import { Professional } from "@/hooks/professionals/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProfessionalStatusBadge } from "./ProfessionalStatusBadge";

interface ProfessionalsGridProps {
  professionals: Professional[];
  onProfessionalClick: (id: string) => void;
}

export const ProfessionalsGrid = ({ professionals, onProfessionalClick }: ProfessionalsGridProps) => {
  if (professionals.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum colaborador encontrado.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {professionals.map((professional) => (
        <Card 
          key={professional.id} 
          className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onProfessionalClick(professional.id)}
        >
          <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <CardContent className="pt-0 relative">
            <div className="flex justify-center -mt-10 mb-3">
              <Avatar className="h-20 w-20 border-4 border-white">
                <AvatarImage src={professional.photoUrl} />
                <AvatarFallback className="text-lg bg-blue-100 text-blue-700">
                  {professional.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="text-center mb-4">
              <h3 className="font-medium text-lg">{professional.name}</h3>
              <p className="text-muted-foreground text-sm">{professional.role}</p>
              <div className="mt-2 flex justify-center">
                <ProfessionalStatusBadge status={professional.status} />
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-muted-foreground" />
                <span className="truncate">{professional.email || "Sem e-mail"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-muted-foreground" />
                <span>{professional.phone || "Sem telefone"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-muted-foreground" />
                <span>{professional.hireDate || "Data não informada"}</span>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-1">
              {professional.specialties.map((specialty, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                  {specialty}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
