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
    loading,
    filterOptions,
    updateFilterOptions,
    addClient,
    deleteClient,
    updateClient,
    addLoyaltyPoints,
    updateMarketingPreferences,
    addClientTag,
    removeClientTag
  } = useClientOperations();
  
  // Get filtered clients
  const filteredClients = useClientFilters(clients, searchTerm, filterOptions);
  
  // Get metadata like available cities and categories
  const { availableCities, availableCategories, availableTags } = useClientMetadata(clients);

  return {
    clients,
    setClients,
    loading,
    addClient,
    deleteClient,
    updateClient,
    addLoyaltyPoints,
    updateMarketingPreferences,
    addClientTag,
    removeClientTag,
    filteredClients,
    filterOptions,
    updateFilterOptions,
    availableCities,
    availableCategories,
    availableTags,
    searchTerm,
    setSearchTerm
  };
};

// Re-export types for convenience
export type { Client, FilterOptions, ClientOperations } from "./types";
