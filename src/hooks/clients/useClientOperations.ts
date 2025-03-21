
import { useState } from "react";
import { Client, FilterOptions } from "./types";
import { initialClients } from "./mockData";

export const useClientOperations = () => {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    spentRange: [0, 1000],
    lastVisitRange: [null, null],
    onlyActive: false,
    cities: [],
    categories: [],
    gender: null
  });

  // Add client
  const addClient = (newClient: Omit<Client, 'id' | 'lastVisit' | 'totalSpent'>) => {
    const clientWithId: Client = {
      id: String(clients.length + 1),
      ...newClient,
      lastVisit: null,
      totalSpent: 0
    };
    setClients([...clients, clientWithId]);
  };

  // Delete client
  const deleteClient = (id: string) => {
    setClients(clients.filter(client => client.id !== id));
  };

  // Update filter options
  const updateFilterOptions = (newOptions: Partial<FilterOptions>) => {
    setFilterOptions({
      ...filterOptions,
      ...newOptions
    });
  };

  return {
    clients,
    setClients,
    filterOptions,
    updateFilterOptions,
    addClient,
    deleteClient
  };
};
