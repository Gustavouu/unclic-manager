
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// These values are exposed to the browser, so this is safe
const supabaseUrl = 'https://zckwriebmvcyvrmznsgf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpja3dyaWVibXZjeXZybXpuc2dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNjYzOTIsImV4cCI6MjA2Mjg0MjM5Mn0.SDzW3_X1c6Aoi84ROaAmnuhmZb-qWjCghPJn7PfxbKA';

// Add a simple in-memory cache for frequently accessed data
const cache = new Map<string, { data: any; timestamp: number }>();

// Cache expiration time in milliseconds (default: 5 minutes)
const DEFAULT_CACHE_EXPIRATION = 5 * 60 * 1000;

/**
 * Fetch data with caching support
 * @param cacheKey Unique key to identify the cached data
 * @param fetchFn Function that returns the data to be cached
 * @param expirationMs Cache expiration time in milliseconds (optional)
 */
export const fetchWithCache = async <T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  expirationMs: number = DEFAULT_CACHE_EXPIRATION
): Promise<T> => {
  const now = Date.now();
  const cachedData = cache.get(cacheKey);
  
  // Return cached data if it exists and hasn't expired
  if (cachedData && now - cachedData.timestamp < expirationMs) {
    return cachedData.data;
  }
  
  // Fetch fresh data
  const data = await fetchFn();
  
  // Store in cache
  cache.set(cacheKey, { data, timestamp: now });
  
  return data;
};

/**
 * Clear the entire cache or a specific key
 * @param cacheKey Optional key to clear specific cache entry
 */
export const clearCache = (cacheKey?: string): void => {
  if (cacheKey) {
    cache.delete(cacheKey);
  } else {
    cache.clear();
  }
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
