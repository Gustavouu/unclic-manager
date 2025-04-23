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
  // Campos adicionais para o sistema de fidelidade
  loyaltyPoints?: number;
  memberSince?: string | null;
  birthdate?: string | null;
  // Campos para segmentação de marketing
  marketingPreferences?: {
    email: boolean;
    whatsapp: boolean;
    sms: boolean;
  };
  tags?: string[];
};

export type FilterOptions = {
  spentRange: [number, number];
  lastVisitRange: [string | null, string | null];
  onlyActive: boolean;
  cities: string[];
  categories: string[];
  gender: string | null;
  // Novos filtros
  loyaltyPointsRange?: [number, number];
  tags?: string[];
  hasMarketingConsent?: boolean;
};

export type ClientOperations = {
  addClient: (newClient: Omit<Client, 'id' | 'lastVisit' | 'totalSpent' | 'loyaltyPoints' | 'memberSince'>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  updateClient?: (id: string, client: Partial<Client>) => Promise<void>;
  addLoyaltyPoints?: (id: string, points: number) => Promise<void>;
  updateMarketingPreferences?: (id: string, preferences: Partial<Client['marketingPreferences']>) => Promise<void>;
  addClientTag?: (id: string, tag: string) => Promise<void>;
  removeClientTag?: (id: string, tag: string) => Promise<void>;
};
