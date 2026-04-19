import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getAppEnv } from "@/lib/config/env";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const env = getAppEnv();

  return createServerClient(env.public.supabaseUrl, env.public.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, options, value }) => cookieStore.set(name, value, options));
        } catch {
          // Server components can read cookies during render, but may not be allowed to write them.
        }
      },
    },
  });
}

export function createSupabaseServiceRoleClient() {
  const env = getAppEnv();

  if (!env.server.supabaseServiceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for service-role access.");
  }

  return createClient(env.public.supabaseUrl, env.server.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
