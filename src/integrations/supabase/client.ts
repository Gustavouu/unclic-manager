
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Try to get environment variables first, then use fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ztwntsmwzstvmoqgiztc.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0d250c213enN0dm1vcWdpenRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNzkxNDMsImV4cCI6MjA2Mjc1NTE0M30.WYYk5DVBrHj6Po6w0VSdiz4ezScu6iPfmultRIpoz_I';

// Log config
console.log("Supabase Client Initialization:");
console.log(`URL: ${supabaseUrl}`);
console.log(`Key: ${supabaseKey ? "Set (length: " + supabaseKey.length + ")" : "Not Set"}`);

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

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

// Helper to check if tables exist in the database
export const checkTableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('count(*)')
      .limit(1);
      
    if (error && error.code === '42P01') {
      console.warn(`Table '${tableName}' does not exist:`, error);
      return false;
    }
    
    return !error;
  } catch (err) {
    console.error(`Error checking if table '${tableName}' exists:`, err);
    return false;
  }
};
