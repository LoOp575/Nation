import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/config/env";

export function createSupabaseAdminClient() {
  const env = getSupabasePublicEnv();
  const secretKey = process.env.SUPABASE_SECRET_KEY?.trim();

  if (!env.configured || !secretKey) {
    throw new Error("Supabase server credentials are not configured.");
  }

  return createClient(env.url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
