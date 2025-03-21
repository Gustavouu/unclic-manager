
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Phone, Mail, CalendarClock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { professionals } from "./data/professionalsMockData";

interface ProfessionalsTableProps {
  onSelectProfessional: (id: string) => void;
}

export const ProfessionalsTable = ({ onSelectProfessional }: ProfessionalsTableProps) => {
  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-[250px] font-medium">Nome</TableHead>
            <TableHead className="hidden md:table-cell font-medium">Contato</TableHead>
            <TableHead className="hidden md:table-cell font-medium">Especialidades</TableHead>
            <TableHead className="hidden md:table-cell font-medium">Status</TableHead>
            <TableHead className="hidden lg:table-cell font-medium">Última Atividade</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {professionals.map((professional) => (
            <TableRow 
              key={professional.id} 
              className="cursor-pointer hover:bg-muted/40 transition-colors" 
              onClick={() => onSelectProfessional(professional.id)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-border/30">
                    <AvatarFallback className={`${professional.active ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                      {professional.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{professional.name}</div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center text-sm">
                    <Phone className="mr-1.5 h-3 w-3 text-muted-foreground" />
                    {professional.phone}
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="mr-1.5 h-3 w-3 text-muted-foreground" />
                    {professional.email}
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex flex-wrap gap-1">
                  {professional.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-normal">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge variant={professional.active ? "default" : "outline"} className={professional.active ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}>
                  {professional.active ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarClock className="mr-1.5 h-3 w-3" />
                  {format(new Date(professional.lastActivity), "dd/MM/yyyy", { locale: ptBR })}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      onSelectProfessional(professional.id);
                    }} className="cursor-pointer">
                      Ver detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">Editar</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 cursor-pointer">
                      {professional.active ? "Desativar" : "Ativar"}
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
