import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Edit, Trash2, UserRound } from "lucide-react";
import { Professional } from "@/hooks/useProfessionalData";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfessionalsTableProps {
  professionals: Professional[];
  onDelete: (id: string) => void;
  onRowClick: (id: string) => void;
  selectedProfessionalId: string | null;
  onShowDetails?: (professionalId: string) => void;
}

export const ProfessionalsTable = ({ 
  professionals, 
  onDelete, 
  onRowClick, 
  selectedProfessionalId,
  onShowDetails
}: ProfessionalsTableProps) => {
  const [professionalToDelete, setProfessionalToDelete] = useState<string | null>(null);

  // Handler for row click that respects both callbacks
  const handleRowClick = (id: string) => {
    onRowClick(id);
    if (onShowDetails) {
      onShowDetails(id);
    }
  };

  // Format date to display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Data indisponível";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

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

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setProfessionalToDelete(id);
  };

  const confirmDelete = () => {
    if (professionalToDelete) {
      onDelete(professionalToDelete);
      setProfessionalToDelete(null);
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

  if (professionals.length === 0) {
    return (
      <div className="text-center py-10">
        <UserRound className="h-12 w-12 mx-auto text-muted-foreground/60 mb-3" />
        <p className="text-muted-foreground mb-1">Nenhum colaborador encontrado</p>
        <p className="text-sm text-muted-foreground/75">Adicione um novo colaborador ou altere sua busca</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Colaborador</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Data de Contratação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {professionals.map((professional) => (
              <TableRow 
                key={professional.id} 
                onClick={() => handleRowClick(professional.id)}
                className={`cursor-pointer transition-colors ${
                  selectedProfessionalId === professional.id ? 'bg-muted' : ''
                }`}
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
                      onClick={(e) => handleDeleteClick(e, professional.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!professionalToDelete} onOpenChange={(open) => !open && setProfessionalToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isto irá remover permanentemente o colaborador
              e todos os dados associados a ele.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
