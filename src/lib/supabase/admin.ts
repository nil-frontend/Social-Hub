import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a privileged Supabase client with the service role key.
 * Used exclusively for server-side trusted operations (e.g., token management,
 * background task telemetry) bypassing Row Level Security.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase admin environment variables");
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
