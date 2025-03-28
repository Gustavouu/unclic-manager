
import { Professional } from "@/hooks/professionals/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfessionalStatusBadge } from "./ProfessionalStatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import React from "react";

interface ProfessionalsGridProps {
  professionals: Professional[];
  onProfessionalClick: (id: string) => void;
  onEditClick: (professional: Professional, e: React.MouseEvent) => void;
  onDeleteClick: (professional: Professional, e: React.MouseEvent) => void;
}

export const ProfessionalsGrid = ({ 
  professionals, 
  onProfessionalClick,
  onEditClick,
  onDeleteClick
}: ProfessionalsGridProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {professionals.map((professional) => (
        <Card key={professional.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <div className="absolute top-2 right-2 z-10">
                <ProfessionalStatusBadge status={professional.status} />
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-24"></div>
              
              <div className="flex flex-col items-center -mt-12 px-4 pb-4">
                <Avatar className="h-24 w-24 border-4 border-white">
                  <AvatarImage src={professional.photoUrl} alt={professional.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                    {getInitials(professional.name)}
                  </AvatarFallback>
                </Avatar>
                
                <h3 className="mt-4 text-lg font-medium text-center">{professional.name}</h3>
                <p className="text-sm text-gray-500 text-center">{professional.role}</p>
                
                <div className="mt-2 flex flex-wrap justify-center gap-1">
                  {professional.specialties.slice(0, 2).map((specialty, i) => (
                    <span key={i} className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                      {specialty}
                    </span>
                  ))}
                  {professional.specialties.length > 2 && (
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      +{professional.specialties.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between p-3 pt-0 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onProfessionalClick(professional.id)}
            >
              <Eye size={16} className="mr-1" />
              Ver
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={(e) => onEditClick(professional, e)}
            >
              <Edit size={16} className="mr-1" />
              Editar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={(e) => onDeleteClick(professional, e)}
            >
              <Trash2 size={16} className="mr-1" />
              Excluir
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
