
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jcdymkgmtxpryceziazt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZHlta2dtdHhwcnljZXppYXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1MjQyNTIsImV4cCI6MjA1ODEwMDI1Mn0.xQxEnFLVLRP_x3TXETogDGTQ4g5qksHLlDWszrEFxwA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
