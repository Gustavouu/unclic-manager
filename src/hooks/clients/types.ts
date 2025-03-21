
// Client and filter related types
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

export type ClientOperations = {
  addClient: (newClient: Omit<Client, 'id' | 'lastVisit' | 'totalSpent'>) => void;
  deleteClient: (id: string) => void;
  updateFilterOptions: (newOptions: Partial<FilterOptions>) => void;
};
