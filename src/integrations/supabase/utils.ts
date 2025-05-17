
import { supabase } from './client';

/**
 * Creates an RPC function to check if a table exists in the database
 */
export async function createTableExistsRPC(): Promise<void> {
  try {
    // Check if the function already exists
    const { data: existingFunction, error: checkError } = await supabase
      .rpc('table_exists', { table_name: 'test' })
      .select();
      
    if (checkError && checkError.message.includes('does not exist')) {
      console.log('Creating table_exists RPC function...');
      
      // Create the function if it doesn't exist
      await supabase.rpc('createRpcFunction', {
        function_name: 'table_exists',
        function_definition: `
          CREATE OR REPLACE FUNCTION public.table_exists(table_name TEXT)
          RETURNS BOOLEAN
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $$
          DECLARE
            schema_name TEXT := 'public';
            exists_bool BOOLEAN;
          BEGIN
            SELECT EXISTS(
              SELECT FROM information_schema.tables 
              WHERE table_schema = schema_name
              AND table_name = $1
            ) INTO exists_bool;
            
            RETURN exists_bool;
          END;
          $$;
        `
      });
    }
  } catch (error) {
    console.error('Error setting up table_exists function:', error);
  }
}

// Initialize the RPC function
createTableExistsRPC().catch(console.error);
