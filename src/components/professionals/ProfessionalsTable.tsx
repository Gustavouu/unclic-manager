
import { Professional } from "@/hooks/professionals/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { ProfessionalStatusBadge } from "./ProfessionalStatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

export interface ProfessionalsTableProps {
  professionals: Professional[];
  onProfessionalClick: (id: string) => void;
  onEditClick: (professional: Professional, e: React.MouseEvent) => void;
  onDeleteClick: (professional: Professional, e: React.MouseEvent) => void;
}

export const ProfessionalsTable = ({
  professionals,
  onProfessionalClick,
  onEditClick,
  onDeleteClick
}: ProfessionalsTableProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Profissional</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Especialidades</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {professionals.map((professional) => (
            <TableRow key={professional.id} className="hover:bg-gray-50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={professional.photoUrl} alt={professional.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {getInitials(professional.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{professional.name}</div>
                    <div className="text-xs text-gray-500">{professional.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{professional.role}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
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
              </TableCell>
              <TableCell>
                <ProfessionalStatusBadge status={professional.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600"
                    onClick={() => onProfessionalClick(professional.id)}
                  >
                    <Eye size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-amber-600"
                    onClick={(e) => onEditClick(professional, e)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600"
                    onClick={(e) => onDeleteClick(professional, e)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}

          {professionals.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                Nenhum profissional encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
