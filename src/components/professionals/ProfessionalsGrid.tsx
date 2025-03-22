
import { Professional } from "@/hooks/professionals/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Mail, Phone, Pencil, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProfessionalStatusBadge } from "./ProfessionalStatusBadge";

interface ProfessionalsGridProps {
  professionals: Professional[];
  onProfessionalClick: (id: string) => void;
  onEditClick?: (professional: Professional, e: React.MouseEvent) => void;
  onDeleteClick?: (professional: Professional, e: React.MouseEvent) => void;
}

export const ProfessionalsGrid = ({ 
  professionals, 
  onProfessionalClick,
  onEditClick,
  onDeleteClick
}: ProfessionalsGridProps) => {
  if (professionals.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum colaborador encontrado.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {professionals.map((professional) => (
        <Card 
          key={professional.id} 
          className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border border-gray-200 hover:border-gray-300"
          onClick={() => onProfessionalClick(professional.id)}
        >
          <CardContent className="p-6 relative">
            <div className="flex justify-between mb-4">
              <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                <AvatarImage src={professional.photoUrl} alt={professional.name} />
                <AvatarFallback className="text-lg bg-slate-100 text-slate-700">
                  {professional.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex gap-1">
                {onEditClick && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-500 hover:text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditClick(professional, e);
                    }}
                  >
                    <Pencil size={16} />
                  </Button>
                )}
                
                {onDeleteClick && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-500 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteClick(professional, e);
                    }}
                  >
                    <Trash size={16} />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium text-lg">{professional.name}</h3>
              <p className="text-muted-foreground text-sm">{professional.role}</p>
              <div className="mt-2">
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
                <Badge key={index} variant="outline" className="bg-slate-50 text-slate-700 hover:bg-slate-100">
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
