import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseReady = Boolean(supabaseUrl && supabaseKey);

// Supabase Third-Party Auth with Clerk: every request carries the current Clerk
// session token. Signed-out visitors get null, so the publishable key is used.
export const supabase = supabaseReady
  ? createClient(supabaseUrl, supabaseKey, {
    accessToken: async () => (await window.Clerk?.session?.getToken()) ?? null,
  })
  : null;
