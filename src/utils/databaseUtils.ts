
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
    // Try to query the table with a limit of 0 rows
    const { error } = await supabase
      .from(tableName as any)
      .select('id')
      .limit(0);
    
    // If there's no error, the table exists
    return !error;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
}
