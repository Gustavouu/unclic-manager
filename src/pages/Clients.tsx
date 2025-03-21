
import { AppLayout } from "@/components/layout/AppLayout";
import { ClientsView } from "@/components/clients/ClientsView";
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
      <ClientsView
        clients={clients}
        filteredClients={filteredClients}
        filterOptions={filterOptions}
        updateFilterOptions={updateFilterOptions}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onDeleteClient={deleteClient}
        onAddClient={addClient}
      />
    </AppLayout>
  );
};

export default Clients;
