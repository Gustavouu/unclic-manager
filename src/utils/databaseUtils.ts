
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if a table exists in the database
 * @param tableName Name of the table to check
 * @returns Boolean indicating if the table exists
 */
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    // Try to query the table with a limit of 0 to minimize data transfer
    const { data, error } = await supabase
      .from(tableName)
      .select('id', { count: 'exact', head: true })
      .limit(0);
      
    // If there's no error, the table exists
    return !error;
  } catch (err) {
    console.error(`Error checking if table ${tableName} exists:`, err);
    return false;
  }
}

/**
 * Parses JSON data safely
 * @param data Data to parse
 * @param defaultValue Default value to return if parsing fails
 * @returns Parsed data or default value
 */
export function safeJsonParse(data: any, defaultValue: any = {}): any {
  if (!data) return defaultValue;
  
  try {
    if (typeof data === 'string') {
      return JSON.parse(data);
    } else if (typeof data === 'object') {
      return data;
    }
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
  
  return defaultValue;
}

/**
 * Helper function to handle database errors for better debugging
 * @param error Error object to handle
 * @param source Source of the error for context
 */
export function handleDatabaseError(error: any, source: string): void {
  if (!error) return;
  
  // Log detailed error information
  console.error(`Database error in ${source}:`, error);
  
  // Return more specific error messages based on error types
  if (error.code === '42P01') {
    console.error('Table does not exist', error.details);
  } else if (error.code === '42703') {
    console.error('Column does not exist', error.details);
  } else if (error.code.startsWith('23')) {
    console.error('Data integrity violation', error.details);
  }
}
