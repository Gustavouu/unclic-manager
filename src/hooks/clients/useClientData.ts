
import { useState } from "react";
import { useClientOperations } from "./useClientOperations";
import { useClientFilters } from "./useClientFilters";
import { useClientMetadata } from "./useClientMetadata";
import { Client, FilterOptions, ClientOperations } from "./types";

export const useClientData = () => {
  // Internal search term state
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get client operations and state
  const {
    clients,
    setClients,
    filterOptions,
    updateFilterOptions,
    addClient,
    deleteClient
  } = useClientOperations();
  
  // Get filtered clients
  const filteredClients = useClientFilters(clients, searchTerm, filterOptions);
  
  // Get metadata like available cities and categories
  const { availableCities, availableCategories } = useClientMetadata(clients);

  return {
    clients,
    setClients,
    addClient,
    deleteClient,
    filteredClients,
    filterOptions,
    updateFilterOptions,
    availableCities,
    availableCategories,
    searchTerm,
    setSearchTerm
  };
};

// Re-export types for convenience
export type { Client, FilterOptions, ClientOperations } from "./types";
