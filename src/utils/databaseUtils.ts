
import { supabase } from "@/integrations/supabase/client";

/**
 * Safely parses a JSON string, returning a default value if parsing fails
 */
export function safeJsonParse<T>(jsonString: string | null | undefined, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return defaultValue;
  }
}

/**
 * Checks if a table exists in the database
 */
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    // Use RPC function to check if table exists
    const { data, error } = await supabase.rpc('table_exists', { table_name: tableName });
    
    if (error) {
      console.error(`Error checking if table ${tableName} exists:`, error);
      return false;
    }
    
    return data === true;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
}

/**
 * Type-safe data extraction from Supabase response
 * Safely extracts data from a Supabase response, handling potential errors
 */
export function safeDataExtract<T>(response: { data: T | null; error: any } | null): T[] {
  if (!response) return [];
  if (response.error) {
    console.error("Error in database query:", response.error);
    return [];
  }
  return (response.data || []) as T[];
}

/**
 * Safely extracts a single item from a Supabase response
 */
export function safeSingleExtract<T>(response: { data: T | null; error: any } | null): T | null {
  if (!response) return null;
  if (response.error) {
    console.error("Error in database query:", response.error);
    return null;
  }
  return response.data;
}
