
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
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfessionalsTableProps {
  professionals: Professional[];
  onProfessionalClick: (id: string) => void;
}

export const ProfessionalsTable = ({ professionals, onProfessionalClick }: ProfessionalsTableProps) => {
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
            <TableHead className="w-[50px]"></TableHead>
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
                    <AvatarImage src={professional.photoUrl} />
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
              <TableCell>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
