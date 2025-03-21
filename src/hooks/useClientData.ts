
import { useState, useEffect, useMemo } from "react";

// Types
export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string | null;
  totalSpent: number;
  gender?: string;
  category?: string;
  city?: string;
};

export type FilterOptions = {
  spentRange: [number, number];
  lastVisitRange: [string | null, string | null];
  onlyActive: boolean;
  cities: string[];
  categories: string[];
  gender: string | null;
};

export const useClientData = () => {
  // Internal search term state
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dados de exemplo para clientes
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "Ana Silva",
      email: "ana.silva@email.com",
      phone: "(11) 98765-4321",
      lastVisit: "2023-10-15",
      totalSpent: 450.00,
      gender: "Feminino",
      category: "VIP",
      city: "São Paulo"
    },
    {
      id: "2",
      name: "Carlos Oliveira",
      email: "carlos.oliveira@email.com",
      phone: "(11) 91234-5678",
      lastVisit: "2023-09-28",
      totalSpent: 275.50,
      gender: "Masculino",
      category: "Regular",
      city: "Rio de Janeiro"
    },
    {
      id: "3",
      name: "Mariana Costa",
      email: "mariana.costa@email.com",
      phone: "(11) 99876-5432",
      lastVisit: "2023-10-05",
      totalSpent: 620.00,
      gender: "Feminino",
      category: "Premium",
      city: "Belo Horizonte"
    },
    {
      id: "4",
      name: "Pedro Santos",
      email: "pedro.santos@email.com",
      phone: "(11) 98877-6655",
      lastVisit: null,
      totalSpent: 0,
      gender: "Masculino",
      category: "Novo",
      city: "Curitiba"
    },
    {
      id: "5",
      name: "Juliana Pereira",
      email: "juliana.pereira@email.com",
      phone: "(11) 97788-9900",
      lastVisit: "2023-10-10",
      totalSpent: 380.75,
      gender: "Feminino",
      category: "Regular",
      city: "São Paulo"
    }
  ]);

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    spentRange: [0, 1000],
    lastVisitRange: [null, null],
    onlyActive: false,
    cities: [],
    categories: [],
    gender: null
  });

  // Detectar todas as cidades e categorias disponíveis
  const availableCities = useMemo(() => 
    [...new Set(clients.map(client => client.city).filter(Boolean) as string[])],
    [clients]
  );

  const availableCategories = useMemo(() => 
    [...new Set(clients.map(client => client.category).filter(Boolean) as string[])],
    [clients]
  );

  // Adicionar cliente
  const addClient = (newClient: Omit<Client, 'id' | 'lastVisit' | 'totalSpent'>) => {
    const clientWithId: Client = {
      id: String(clients.length + 1),
      ...newClient,
      lastVisit: null,
      totalSpent: 0
    };
    setClients([...clients, clientWithId]);
  };

  // Excluir cliente
  const deleteClient = (id: string) => {
    setClients(clients.filter(client => client.id !== id));
  };

  // Atualizar opções de filtro
  const updateFilterOptions = (newOptions: Partial<FilterOptions>) => {
    setFilterOptions({
      ...filterOptions,
      ...newOptions
    });
  };

  // Filtrar clientes com base no termo de pesquisa e nas opções de filtro
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      // Filtro por termo de pesquisa
      const matchesSearch = searchTerm === "" || 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm);
      
      if (!matchesSearch) return false;
      
      // Filtro por faixa de gastos
      const matchesSpent = client.totalSpent >= filterOptions.spentRange[0] && 
                          client.totalSpent <= filterOptions.spentRange[1];
      
      if (!matchesSpent) return false;
      
      // Filtro por clientes ativos
      if (filterOptions.onlyActive && client.lastVisit === null) {
        return false;
      }
      
      // Filtro por cidades
      if (filterOptions.cities.length > 0 && client.city && 
          !filterOptions.cities.includes(client.city)) {
        return false;
      }
      
      // Filtro por categorias
      if (filterOptions.categories.length > 0 && client.category && 
          !filterOptions.categories.includes(client.category)) {
        return false;
      }
      
      // Filtro por gênero
      if (filterOptions.gender && client.gender !== filterOptions.gender) {
        return false;
      }
      
      return true;
    });
  }, [clients, searchTerm, filterOptions]);

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
