
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Filter, UserPlus } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { NewClientDialog } from "@/components/clients/NewClientDialog";
import { ClientFilters } from "@/components/clients/ClientFilters";
import { ClientDetails } from "@/components/clients/ClientDetails";
import { useToast } from "@/components/ui/use-toast";
import { useClientData } from "@/hooks/useClientData";

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { 
    clients, 
    addClient, 
    deleteClient,
    filteredClients,
    filterOptions,
    updateFilterOptions
  } = useClientData(searchTerm);

  const handleAddClient = (newClient) => {
    addClient(newClient);
    setIsNewClientDialogOpen(false);
    
    toast({
      title: "Cliente adicionado",
      description: `${newClient.name} foi adicionado com sucesso.`
    });
  };

  const handleDeleteClient = (id: string) => {
    deleteClient(id);
    
    // Se o cliente selecionado for excluído, feche os detalhes
    if (selectedClientId === id) {
      setSelectedClientId(null);
    }
    
    toast({
      title: "Cliente removido",
      description: `O cliente foi removido com sucesso.`
    });
  };

  const handleClientClick = (id: string) => {
    setSelectedClientId(prevId => prevId === id ? null : id);
  };

  return (
    <AppLayout title="Clientes">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-xl font-display font-medium">Gerenciamento de Clientes</h1>
        
        <NewClientDialog 
          isOpen={isNewClientDialogOpen} 
          onOpenChange={setIsNewClientDialogOpen}
          onSubmit={handleAddClient}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className={`md:col-span-${selectedClientId ? '2' : '3'}`}>
          <Card className="shadow-sm">
            <div className="p-6">
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <input 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    placeholder="Buscar clientes por nome, email ou telefone" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  >
                    <Filter size={16} />
                    Filtros
                  </Button>
                  
                  <Button className="gap-2" onClick={() => setIsNewClientDialogOpen(true)}>
                    <UserPlus size={16} />
                    Novo Cliente
                  </Button>
                </div>
              </div>
              
              {isFiltersOpen && (
                <ClientFilters 
                  filterOptions={filterOptions}
                  updateFilterOptions={updateFilterOptions}
                />
              )}
              
              <ClientsTable 
                clients={filteredClients} 
                onDelete={handleDeleteClient} 
                onRowClick={handleClientClick}
                selectedClientId={selectedClientId}
              />
            </div>
          </Card>
        </div>
        
        {selectedClientId && (
          <div className="md:col-span-1">
            <ClientDetails 
              clientId={selectedClientId} 
              onClose={() => setSelectedClientId(null)} 
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Clients;
