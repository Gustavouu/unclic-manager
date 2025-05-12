
/**
 * Utility functions for caching data and managing Supabase calls
 */

/**
 * Fetches data with a local storage cache to reduce network calls
 * 
 * @param cacheKey The unique key for storing in localStorage
 * @param fetchFn The function to call if cache is invalid
 * @param ttlMinutes Cache time-to-live in minutes
 * @param forceRefresh Whether to force refresh the data
 */
export async function fetchWithCache<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  ttlMinutes = 15,
  forceRefresh = false
): Promise<T> {
  try {
    // Skip cache if forceRefresh is true
    if (!forceRefresh) {
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const age = (Date.now() - timestamp) / (1000 * 60); // Convert to minutes
        
        if (age < ttlMinutes) {
          console.log(`Using cached data for ${cacheKey}, age: ${age.toFixed(1)} minutes`);
          return data as T;
        } else {
          console.log(`Cache expired for ${cacheKey}, age: ${age.toFixed(1)} minutes`);
        }
      }
    }
    
    // Fetch fresh data
    console.log(`Fetching fresh data for ${cacheKey}`);
    const data = await fetchFn();
    
    // Store in cache
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (err) {
      console.warn('Failed to store data in cache:', err);
      // Continue without caching
    }
    
    return data;
  } catch (err) {
    console.error(`Error fetching data for ${cacheKey}:`, err);
    
    // Try to use expired cache as fallback
    try {
      const expired = localStorage.getItem(cacheKey);
      if (expired) {
        console.warn(`Using expired cache as fallback for ${cacheKey}`);
        const { data } = JSON.parse(expired);
        return data as T;
      }
    } catch (cacheErr) {
      console.error('Failed to read expired cache:', cacheErr);
    }
    
    throw err; // Re-throw if no fallback available
  }
}

/**
 * Clears all application caches
 */
export function clearAllCaches() {
  try {
    // Get all keys that look like cache keys
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      // Add keys that match cache patterns
      if (key && (
        key.includes('cache_') ||
        key.includes('business_') ||
        key.includes('user_') ||
        key.includes('currentBusinessId') ||
        key.includes('tenant_')
      )) {
        keysToRemove.push(key);
      }
    }
    
    // Remove all identified cache keys
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log(`Cleared ${keysToRemove.length} cache items`);
    
    return keysToRemove.length;
  } catch (err) {
    console.error('Error clearing caches:', err);
    return 0;
  }
}

/**
 * Run multiple promises with individual timeouts and continue even if some fail
 */
export async function executeParallel<T>(
  tasks: Array<{ key: string, promise: () => Promise<T>, timeoutMs?: number }>
): Promise<Record<string, { data: T | null, error: Error | null }>> {
  const results: Record<string, { data: T | null, error: Error | null }> = {};
  
  await Promise.all(tasks.map(async ({ key, promise, timeoutMs = 5000 }) => {
    try {
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
      );
      
      // Race the promise against a timeout
      const data = await Promise.race([promise(), timeoutPromise]);
      results[key] = { data, error: null };
    } catch (err: any) {
      console.warn(`Task ${key} failed:`, err.message);
      results[key] = { 
        data: null, 
        error: err instanceof Error ? err : new Error(err?.message || `Unknown error in task ${key}`) 
      };
    }
  }));
  
  return results;
}
