
export interface Webhook {
  id: string;
  date: string;
  product: string;
  url: string;
  authentication: string;
}

export type SortField = 'date' | 'product' | null;
export type SortDirection = 'asc' | 'desc';
