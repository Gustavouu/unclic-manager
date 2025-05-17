
import { supabase } from "@/integrations/supabase/client";

/**
 * Safely parses a JSON string, returning a default value if parsing fails
 */
export function safeJsonParse<T>(jsonString: string | null | undefined | object, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  
  // If it's already an object (not a string), return it directly
  if (typeof jsonString === 'object') return jsonString as T;
  
  try {
    return JSON.parse(jsonString as string) as T;
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

/**
 * Tries to query a table, and if it doesn't exist, tries an alternative table
 * @param primaryTable Primary table to query
 * @param alternativeTable Alternative table to query if primary doesn't exist
 * @param query Function that performs the actual query given a table name
 */
export async function adaptiveTableQuery<T>(
  primaryTable: string, 
  alternativeTable: string, 
  query: (tableName: string) => Promise<{ data: T | null; error: any } | null>
): Promise<{ data: T | null; error: any } | null> {
  try {
    // Try the primary table first
    const primaryExists = await tableExists(primaryTable);
    if (primaryExists) {
      return await query(primaryTable);
    }
    
    // If primary table doesn't exist, try the alternative
    const alternativeExists = await tableExists(alternativeTable);
    if (alternativeExists) {
      return await query(alternativeTable);
    }
    
    // If neither table exists
    console.error(`Neither ${primaryTable} nor ${alternativeTable} tables exist`);
    return { data: null, error: new Error(`Tables not found: ${primaryTable}, ${alternativeTable}`) };
  } catch (error) {
    console.error(`Error in adaptiveTableQuery:`, error);
    return { data: null, error };
  }
}
