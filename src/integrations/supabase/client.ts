
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// These values are exposed to the browser, so this is safe
const supabaseUrl = 'https://zckwriebmvcyvrmznsgf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpja3dyaWVibXZjeXZybXpuc2dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNjYzOTIsImV4cCI6MjA2Mjg0MjM5Mn0.SDzW3_X1c6Aoi84ROaAmnuhmZb-qWjCghPJn7PfxbKA';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
