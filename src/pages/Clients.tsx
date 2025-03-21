
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserPlus, Edit, Trash2, Mail, Phone } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

// Types
type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string | null;
  totalSpent: number;
};

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "Ana Silva",
      email: "ana.silva@email.com",
      phone: "(11) 98765-4321",
      lastVisit: "2023-10-15",
      totalSpent: 450.00
    },
    {
      id: "2",
      name: "Carlos Oliveira",
      email: "carlos.oliveira@email.com",
      phone: "(11) 91234-5678",
      lastVisit: "2023-09-28",
      totalSpent: 275.50
    },
    {
      id: "3",
      name: "Mariana Costa",
      email: "mariana.costa@email.com",
      phone: "(11) 99876-5432",
      lastVisit: "2023-10-05",
      totalSpent: 620.00
    },
    {
      id: "4",
      name: "Pedro Santos",
      email: "pedro.santos@email.com",
      phone: "(11) 98877-6655",
      lastVisit: null,
      totalSpent: 0
    },
    {
      id: "5",
      name: "Juliana Pereira",
      email: "juliana.pereira@email.com",
      phone: "(11) 97788-9900",
      lastVisit: "2023-10-10",
      totalSpent: 380.75
    }
  ]);
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState<Omit<Client, 'id' | 'lastVisit' | 'totalSpent'>>({
    name: "",
    email: "",
    phone: ""
  });
  const { toast } = useToast();

  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  // Add new client
  const handleAddClient = () => {
    if (!newClient.name || !newClient.email || !newClient.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const newClientWithId: Client = {
      id: String(clients.length + 1),
      ...newClient,
      lastVisit: null,
      totalSpent: 0
    };

    setClients([...clients, newClientWithId]);
    setNewClient({ name: "", email: "", phone: "" });
    setIsNewClientDialogOpen(false);
    
    toast({
      title: "Cliente adicionado",
      description: `${newClient.name} foi adicionado com sucesso.`
    });
  };

  // Delete client
  const handleDeleteClient = (id: string) => {
    const clientToDelete = clients.find(client => client.id === id);
    setClients(clients.filter(client => client.id !== id));
    
    toast({
      title: "Cliente removido",
      description: `${clientToDelete?.name} foi removido com sucesso.`
    });
  };

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

  return (
    <AppLayout title="Clientes">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-xl font-display font-medium">Gerenciamento de Clientes</h1>
        
        <Dialog open={isNewClientDialogOpen} onOpenChange={setIsNewClientDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus size={16} />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
              <DialogDescription>
                Preencha os dados do cliente para adicionar ao sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome completo*</Label>
                <Input 
                  id="name" 
                  value={newClient.name} 
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})} 
                  placeholder="Nome do cliente"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail*</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={newClient.email} 
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})} 
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone*</Label>
                <Input 
                  id="phone" 
                  value={newClient.phone} 
                  onChange={(e) => setNewClient({...newClient, phone: e.target.value})} 
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewClientDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddClient}>Adicionar Cliente</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <div className="p-6">
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Buscar clientes por nome, email ou telefone" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {filteredClients.length === 0 ? (
            <div className="text-center py-10">
              <UserPlus className="h-12 w-12 mx-auto text-muted-foreground/60 mb-3" />
              <p className="text-muted-foreground mb-1">Nenhum cliente encontrado</p>
              <p className="text-sm text-muted-foreground/75">Adicione um novo cliente ou altere sua busca</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Última visita</TableHead>
                    <TableHead>Total gasto</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
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
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-destructive hover:text-destructive/90"
                            onClick={() => handleDeleteClient(client.id)}
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
          )}
        </div>
      </Card>
    </AppLayout>
  );
};

export default Clients;
