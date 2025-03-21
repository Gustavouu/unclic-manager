
import { Professional } from "@/hooks/useProfessionalData";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfessionalTableRowProps {
  professional: Professional;
  onRowClick: (id: string) => void;
  isSelected: boolean;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

export const ProfessionalTableRow = ({ 
  professional, 
  onRowClick, 
  isSelected,
  onDelete
}: ProfessionalTableRowProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'vacation':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'vacation':
        return 'Em férias';
      default:
        return status;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Data indisponível";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <TableRow 
      onClick={() => onRowClick(professional.id)}
      className={`cursor-pointer transition-colors ${isSelected ? 'bg-muted' : ''}`}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={professional.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(professional.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{professional.name}</div>
            <div className="text-sm text-muted-foreground">{professional.specialty}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-sm">
            <Mail className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            <span>{professional.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            <span>{professional.phone}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>{professional.role}</TableCell>
      <TableCell>{formatDate(professional.hireDate)}</TableCell>
      <TableCell>
        <Badge className={getStatusColor(professional.status)} variant="outline">
          {getStatusText(professional.status)}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Editar</span>
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-destructive hover:text-destructive/90"
            onClick={(e) => onDelete(e, professional.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Excluir</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
