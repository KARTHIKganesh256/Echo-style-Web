import { createClient } from '@supabase/supabase-js';

// Supabase configuration - these are public keys and safe to commit
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fcujblneuxjtvxxafyne.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjdWpibG5ldXhqdHZ4eGFmeW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NDM5MjAsImV4cCI6MjA3NTUxOTkyMH0.h8H0QGanIK8-bNImNah6CDLNmYM87DMS9D4hDBrDalM';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
