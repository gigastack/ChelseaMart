import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function isRefreshTokenNotFoundError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  return "code" in error && error.code === "refresh_token_not_found";
}

export async function getSupabaseUserOrNull(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  } catch (error) {
    if (isRefreshTokenNotFoundError(error)) {
      return null;
    }

    throw error;
  }
}
