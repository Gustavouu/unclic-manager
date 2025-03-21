
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Edit, Trash2, User } from "lucide-react";
import { Client } from "@/hooks/useClientData";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface ClientsTableProps {
  clients: Client[];
  onDelete: (id: string) => void;
  onRowClick: (id: string) => void;
  selectedClientId: string | null;
}

export const ClientsTable = ({ clients, onDelete, onRowClick, selectedClientId }: ClientsTableProps) => {
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  // Format date to display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Nunca visitou";
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

  const getClientCategoryColor = (category?: string) => {
    switch (category) {
      case 'VIP':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'Premium':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'Regular':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Novo':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setClientToDelete(id);
  };

  const confirmDelete = () => {
    if (clientToDelete) {
      onDelete(clientToDelete);
      setClientToDelete(null);
    }
  };

  if (clients.length === 0) {
    return (
      <div className="text-center py-10">
        <User className="h-12 w-12 mx-auto text-muted-foreground/60 mb-3" />
        <p className="text-muted-foreground mb-1">Nenhum cliente encontrado</p>
        <p className="text-sm text-muted-foreground/75">Adicione um novo cliente ou altere sua busca</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Última visita</TableHead>
              <TableHead>Total gasto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow 
                key={client.id} 
                onClick={() => onRowClick(client.id)}
                className={`cursor-pointer transition-colors ${
                  selectedClientId === client.id ? 'bg-muted' : ''
                }`}
              >
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-sm">
                      <Mail className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      <span>{client.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      <span>{client.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={client.lastVisit ? "" : "text-muted-foreground italic"}>
                    {formatDate(client.lastVisit)}
                  </span>
                </TableCell>
                <TableCell>{formatCurrency(client.totalSpent)}</TableCell>
                <TableCell>
                  {client.category && (
                    <Badge className={getClientCategoryColor(client.category)} variant="outline">
                      {client.category}
                    </Badge>
                  )}
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
                      onClick={(e) => handleDeleteClick(e, client.id)}
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

      <AlertDialog open={!!clientToDelete} onOpenChange={(open) => !open && setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isto irá remover permanentemente o cliente
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
