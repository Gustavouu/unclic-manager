
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
  );
};

export default Clients;
