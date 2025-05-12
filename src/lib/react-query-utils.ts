
import { useQuery, useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (renamed from cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Generate stable cache keys for Supabase queries
export const createQueryKey = (table: string, params?: any) => {
  if (!params) return [table];
  return [table, JSON.stringify(params)];
};

// Type for pagination parameters
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// Reusable hook for fetching paginated data from Supabase
export function useSupabaseQuery<T>(
  table: string,
  {
    page = 0,
    pageSize = 10,
    select = '*',
    filters = {},
    sortBy = { column: 'created_at', ascending: false },
    enabled = true,
  }: {
    page?: number;
    pageSize?: number;
    select?: string;
    filters?: Record<string, any>;
    sortBy?: { column: string; ascending: boolean };
    enabled?: boolean;
  }
) {
  const queryKey = createQueryKey(table, { page, pageSize, filters, sortBy });

  return useQuery({
    queryKey,
    queryFn: async () => {
      // Calculate start and end for pagination
      const start = page * pageSize;
      const end = start + pageSize - 1;
      
      // Start building the query
      let query = supabase
        .from(table)
        .select(select, { count: 'exact' })
        .order(sortBy.column, { ascending: sortBy.ascending });
        
      // Apply filters dynamically
      Object.entries(filters).forEach(([column, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            query = query.in(column, value);
          } else if (typeof value === 'object' && value !== null) {
            // Handle range filters or special operators
            if ('gte' in value) query = query.gte(column, value.gte);
            if ('lte' in value) query = query.lte(column, value.lte);
            if ('like' in value) query = query.like(column, value.like);
          } else {
            query = query.eq(column, value);
          }
        }
      });
      
      // Apply pagination
      query = query.range(start, end);
      
      // Execute the query
      const { data, error, count } = await query;
      
      if (error) {
        console.error(`Error fetching ${table}:`, error);
        throw new Error(`Error fetching ${table}: ${error.message}`);
      }
      
      return {
        data: data as T[],
        meta: {
          page,
          pageSize,
          totalCount: count || 0,
          totalPages: count ? Math.ceil(count / pageSize) : 0,
          hasNextPage: count ? start + pageSize < count : false,
          hasPreviousPage: page > 0,
        }
      };
    },
    enabled,
  });
}

// Helper for invalidating specific queries or table data
export function invalidateQueries(queryClient: QueryClient, table: string, params?: any) {
  if (params) {
    queryClient.invalidateQueries({ queryKey: createQueryKey(table, params) });
  } else {
    queryClient.invalidateQueries({ queryKey: [table] });
  }
}
