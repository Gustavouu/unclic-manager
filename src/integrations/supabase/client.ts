
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const SUPABASE_URL = "https://ztwntsmwzstvmoqgiztc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0d250c213enN0dm1vcWdpenRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNzkxNDMsImV4cCI6MjA2Mjc1NTE0M30.WYYk5DVBrHj6Po6w0VSdiz4ezScu6iPfmultRIpoz_I";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
