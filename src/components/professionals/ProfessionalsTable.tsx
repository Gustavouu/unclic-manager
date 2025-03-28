
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Professional } from "@/hooks/professionals/types";
import { ProfessionalStatusBadge } from "./ProfessionalStatusBadge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

interface ProfessionalsTableProps {
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
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Profissional</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Especialidades</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {professionals.map((professional) => (
            <TableRow key={professional.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={professional.photoUrl} alt={professional.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {getInitials(professional.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{professional.name}</div>
                    <div className="text-sm text-gray-500">{professional.email}</div>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal size={16} />
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onProfessionalClick(professional.id)}>
                      <Eye size={16} className="mr-2" />
                      Ver detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => onEditClick(professional, e)}>
                      <Edit size={16} className="mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-500 focus:text-red-500"
                      onClick={(e) => onDeleteClick(professional, e)}
                    >
                      <Trash2 size={16} className="mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
