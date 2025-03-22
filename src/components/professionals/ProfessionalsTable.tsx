
import { Professional } from "@/hooks/professionals/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProfessionalStatusBadge } from "./ProfessionalStatusBadge";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfessionalsTableProps {
  professionals: Professional[];
  onProfessionalClick: (id: string) => void;
  onEditClick?: (professional: Professional, e: React.MouseEvent) => void;
  onDeleteClick?: (professional: Professional, e: React.MouseEvent) => void;
}

export const ProfessionalsTable = ({ 
  professionals, 
  onProfessionalClick,
  onEditClick,
  onDeleteClick 
}: ProfessionalsTableProps) => {
  if (professionals.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum colaborador encontrado.
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[250px]">Nome</TableHead>
            <TableHead>Especializações</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Data de Contratação</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {professionals.map((professional) => (
            <TableRow 
              key={professional.id}
              className="cursor-pointer hover:bg-muted/80"
              onClick={() => onProfessionalClick(professional.id)}
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={professional.photoUrl} alt={professional.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {professional.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div>{professional.name}</div>
                    <div className="text-sm text-muted-foreground">{professional.role || "Não especificado"}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {professional.specialties.slice(0, 2).map((specialty, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                      {specialty}
                    </Badge>
                  ))}
                  {professional.specialties.length > 2 && (
                    <Badge variant="outline" className="bg-gray-100">
                      +{professional.specialties.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{professional.email || "Sem e-mail"}</div>
                  <div className="text-muted-foreground">{professional.phone || "Sem telefone"}</div>
                </div>
              </TableCell>
              <TableCell>{professional.hireDate || "Não informada"}</TableCell>
              <TableCell>
                <ProfessionalStatusBadge status={professional.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
