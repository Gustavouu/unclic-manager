
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ClientsLayout } from "@/components/clients/ClientsLayout";
import { useToast } from "@/components/ui/use-toast";
import { useClientData } from "@/hooks/useClientData";

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
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
    
    toast({
      title: "Cliente adicionado",
      description: `${newClient.name} foi adicionado com sucesso.`
    });
  };

  const handleDeleteClient = (id: string) => {
    deleteClient(id);
    
    toast({
      title: "Cliente removido",
      description: `O cliente foi removido com sucesso.`
    });
  };

  return (
    <AppLayout title="Clientes">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-xl font-display font-medium">Gerenciamento de Clientes</h1>
      </div>
      
      <ClientsLayout 
        clients={clients}
        filteredClients={filteredClients}
        filterOptions={filterOptions}
        updateFilterOptions={updateFilterOptions}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onDeleteClient={handleDeleteClient}
        onAddClient={handleAddClient}
      />
    </AppLayout>
  );
};

export default Clients;
