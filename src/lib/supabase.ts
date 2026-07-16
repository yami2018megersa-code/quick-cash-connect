import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "[NuDawn] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Set them in your .env to enable applications.",
  );
}

export const supabase = createClient(url ?? "http://localhost", anonKey ?? "public-anon-key", {
  auth: { persistSession: false, autoRefreshToken: false },
});

export const isSupabaseConfigured = Boolean(url && anonKey);
