
import { PostgrestSingleResponse, PostgrestResponse } from '@supabase/supabase-js';

/**
 * Checks if a table exists in the database
 * @param tableName The name of the table to check
 * @returns A boolean indicating whether the table exists
 */
export const tableExists = async (tableName: string): Promise<boolean> => {
  // We're using a simple true for now as a placeholder
  // In a real implementation, you'd want to query the information_schema
  try {
    const { data, error } = await supabase.rpc('table_exists', { table_name: tableName });
    if (error) throw error;
    return data || false;
  } catch (err) {
    console.error(`Error checking if table ${tableName} exists:`, err);
    return false;
  }
};

/**
 * Safely extracts data from a Supabase response, handling errors
 * @param response The Supabase response
 * @returns The data from the response, or an empty array if there was an error
 */
export const safeDataExtract = <T>(response: PostgrestResponse<T>): T[] => {
  if (response.error) {
    console.error('Error in database query:', response.error);
    return [];
  }
  return response.data || [];
};

/**
 * Safely extracts a single item from a Supabase response, handling errors
 * @param response The Supabase response
 * @returns The single item from the response, or null if there was an error
 */
export const safeSingleExtract = <T>(response: PostgrestSingleResponse<T>): T | null => {
  if (response.error) {
    console.error('Error in database query:', response.error);
    return null;
  }
  return response.data;
};

/**
 * Transforms a database response to handle both modern and legacy schemas
 * @param data The data to transform
 * @param transformFn The function to transform each item
 * @returns The transformed data
 */
export const transformDatabaseResponse = <T, R>(
  data: T[],
  transformFn: (item: T) => R
): R[] => {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  
  return data.map(transformFn);
};

/**
 * Safely parse JSON string to object
 * @param jsonString The JSON string to parse
 * @param defaultValue The default value to return if parsing fails
 * @returns The parsed object or the default value
 */
export const safeJsonParse = <T>(jsonString: string | object, defaultValue: T): T => {
  // If it's already an object, just return it
  if (typeof jsonString !== 'string') {
    return jsonString as unknown as T;
  }
  
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return defaultValue;
  }
};
