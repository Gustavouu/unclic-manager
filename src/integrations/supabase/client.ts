
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ztwntsmwzstvmoqgiztc.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Cache utility for data fetching
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number; // in minutes
}

const cache = new Map<string, CacheItem<any>>();

export const fetchWithCache = async <T>(
  key: string,
  fetchFn: () => Promise<T>,
  expiry: number = 5 // Default 5 minutes
): Promise<T> => {
  const now = Date.now();
  const cachedItem = cache.get(key);

  if (cachedItem && now - cachedItem.timestamp < cachedItem.expiry * 60 * 1000) {
    return cachedItem.data;
  }

  // Fetch fresh data
  const data = await fetchFn();
  
  // Store in cache
  cache.set(key, {
    data,
    timestamp: now,
    expiry
  });

  return data;
};
