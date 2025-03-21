
import { AppLayout } from "@/components/layout/AppLayout";
import { ClientsLayout } from "@/components/clients/ClientsLayout";
import { useClientData } from "@/hooks/useClientData";

const Clients = () => {
  const {
    clients,
    filteredClients,
    filterOptions,
    updateFilterOptions,
    searchTerm,
    setSearchTerm,
    deleteClient,
    addClient
  } = useClientData();

  return (
    <AppLayout title="Clientes">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-display font-bold">Gerenciamento de Clientes</h1>
          <p className="text-muted-foreground">Visualize e gerencie seus clientes cadastrados.</p>
        </div>

        <ClientsLayout
          clients={clients}
          filteredClients={filteredClients}
          filterOptions={filterOptions}
          updateFilterOptions={updateFilterOptions}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onDeleteClient={deleteClient}
          onAddClient={addClient}
        />
      </div>
    </AppLayout>
  );
};

export default Clients;
